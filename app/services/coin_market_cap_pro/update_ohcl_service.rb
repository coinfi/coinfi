module CoinMarketCapPro
  class UpdateOhclService < Patterns::Service
    include CoinMarketCapProHelpers
    include CoinListHelper
    attr_reader :cmc_missing_data

    def initialize(coin_ids: nil, start_date: Date.new(2019, 2, 20), healthcheck_url: nil)
      @cmc_missing_data = []
      @target_coin_ids = coin_ids
      @start_date = start_date
      @healthcheck_url = healthcheck_url
    end

    def call
      cmc_coin_ids = get_cmc_coin_ids
      if @target_coin_ids.present?
        # Get cmc_ids
        target_cmc_coin_ids = Coin.where(id: @target_coin_ids).pluck(:cmc_id)
        # Ensure targetted coins exist
        filtered_target_cmc_coin_ids = target_cmc_coin_ids.filter {|id| cmc_coin_ids.include?(id.to_s)}
        if filtered_target_cmc_coin_ids.size == 0
          puts "[WARNING] All coin IDs are not available on CMC."
          return
        elsif filtered_target_cmc_coin_ids.size != target_cmc_coin_ids.size
          puts "[WARNING] Coin IDs not available on CMC: #{target_cmc_coin_ids - filtered_target_cmc_coin_ids}"
        end
        target_cmc_coin_ids = filtered_target_cmc_coin_ids
      else
        target_cmc_coin_ids = cmc_coin_ids
      end

      # remove IDs we can't map since we won't use them
      coin_key_mapping = Coin.where(cmc_id: target_cmc_coin_ids).pluck(:cmc_id, :id).to_h
      coin_key_mapping.transform_keys! {|cmc_id| cmc_id.to_s }

      ohcls = download_ohcl_data(coin_key_mapping, @start_date.to_datetime)
      insert_ohcls(ohcls)

      log_or_ping_on_missing_data(@cmc_missing_data, @healthcheck_url)

      ohcls
    end

    private

    def has_missing_data(data)
      data.nil? || data[:open].blank? || data[:high].blank? ||
        data[:low].blank? || data[:close].blank? ||
        data[:volume_to].blank?
    end

    def insert_ohcls(ohcls)
      ohcls.each do |ohcl|
        insert_ohcl(ohcl)
      end
    end

    def insert_ohcl(ohcl)
      if has_missing_data(ohcl)
        identifier = ohcl.dig(:coin_id)
        @cmc_missing_data << { identifier: identifier, data: ohcl }
      else
        begin
          DailyOhclPrice.create!(ohcl)
        rescue ActiveRecord::RecordNotUnique => e
        end
      end
    end

    # Downloads OHCL data for all coins and currencies.
    #
    # :param cmc_ids: Array of Coinmarketcap ids
    # :param time_of_request: DateTime of request for retrieving data
    # TODO: Parallelize requests
    def download_ohcl_data(coin_mapping, time_of_request)
      start = DateTime.current.to_f

      previous_interval = get_previous_time_interval time_of_request
      puts "Start downloading OHCL data from coinmarketcap for #{previous_interval}"

      # Start time is exclusive, so to retrieve the previous time unit, we need to go further back
      # e.g., at 4AM, we attempt to retrieve 3AM data, so we must input a start time before 3AM, for example, 2AM
      start_time = previous_interval - 1.day
      epoch = (start_time.to_f * 1000).to_i

      url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/ohlcv/historical"

      progress = ProgressBar.create(:title => 'coins', :total => coin_mapping.size)
      responses = coin_mapping.map do |(cmc_id, coin_id)|
        query = {
          id: cmc_id,
          convert: 'USD',
          count: 1,
          time_start: epoch,
          time_period: 'daily',
          interval: 'daily',
        }
        headers = get_default_api_headers

        max_retries = 5
        retries = 0
        begin
          response = HTTParty.get(url, :query => query, :headers => headers)

          unless response.success?
            if response.code == 0
              # Could not get an http response, something's wrong.
              raise HTTParty::Error.new "#{response.return_message}"
            elsif response.code == 429
              body = JSON.parse(response.body)
              json_response_code = get_json_response_code body
              if json_response_code == 1008
                # 1-min rate limit - assume 30s wait is good enough at first
                if retries == 0
                  sleep 30
                else
                  sleep 60
                end
                raise HTTParty::Error.new "Rate limited"
              else
                # Don't raise HTTParty::Error - we don't want to retry
                raise "#{(cmc_id)} Got unretryable rate limit error code #{json_response_code}"
              end
            elsif response.code >= 400 && response.code < 500
              body = JSON.parse(response.body)
              json_error = get_error_message body

              raise HTTParty::Error.new "HTTP request failed: #{response.code} with error: #{json_error}"
            else
              # Received a non-successful http response.
              raise HTTParty::Error.new "HTTP request failed: " + response.code.to_s
            end
          end
        rescue HTTParty::Error, Net::OpenTimeout => e
          puts "#{(cmc_id)} #{e}"
          if (retries += 1) <= max_retries
            sleep 1
            retry
          else
            @cmc_missing_data << { identifier: coin_id, data: nil }
            response = nil
          end
        end

        progress.increment

        response
      end

      results = responses.map do |response|
        raw_ohcl = extract_api_data(response, @healthcheck_url)
        result = process_raw_ohcl(raw_ohcl, time_of_request, coin_mapping) if raw_ohcl.present?
      end.compact

      num_elements = results.size
      elapsed_time = DateTime.current.to_f - start
      puts "Finished downloading #{num_elements} ohcl entries. " \
        "It took #{'%.2f' % elapsed_time} seconds at a rate of #{'%.2f' % (num_elements / elapsed_time)} elements per second"
      results
    end

    # Extract relevant information from raw contents and map external ids to coin_keys.
    # https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyOhlcvHistorical
    def process_raw_ohcl(raw_ohcl, requested_ts, coin_keys)
      cmc_id = raw_ohcl.fetch('id', nil)&.to_s
      # the list should only ever have 1 item since we only request 1 count
      quote_entry = (raw_ohcl.dig('quotes').presence || [{}]).first
      # there should only ever be one dictionary key pair
      data = quote_entry.fetch('quote', {}).dig('USD')

      if data.present? && coin_keys.dig(cmc_id).present?
        time_open = quote_entry["time_open"]
        if time_open.present?
          timestamp = time_open.to_datetime
        else
          timestamp = expected_interval
        end

        ohcl = {
          coin_id: coin_keys[cmc_id],
          time: timestamp,
          to_currency: 'USD',
          open: data.fetch('open', nil),
          high: data.fetch('high', nil),
          low: data.fetch('low', nil),
          close: data.fetch('close', nil),
          volume_to: data.fetch('volume', nil),
        }
      end
    end

    # Return cmc coins id list from map.
    def get_cmc_coin_ids
      coins = get_cmc_coins
      ids = coins.map {|coin| coin['id'].to_s}
    end

    # Return cmc coins from map.
    def get_cmc_coins
      map_url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map'

      query = { listing_status: 'active' }
      headers = get_default_api_headers

      max_retries = 5
      retries = 0
      begin
        response = HTTParty.get(map_url, :query => query, :headers => headers)

        unless response.success?
          if response.code == 429
            body = JSON.parse(response.body)
            json_response_code = get_json_response_code body
            if json_response_code == 1008
              # 1-min rate limit - assume 30s wait is good enough at first
              if retries == 0
                sleep 30
              else
                sleep 60
              end
              raise HTTParty::Error.new "Rate limited"
            else
              # Don't raise HTTParty::Error - we don't want to retry
              raise "#{(cmc_id)} Got unretryable rate limit error code #{json_response_code}"
            end
          else
            # Received a non-successful http response.
            raise HTTParty::Error.new "HTTP request failed: " + response.code.to_s
          end
        end
      rescue HTTParty::Error
        puts "Coin Map: #{e}"
        if (retries += 1) <= max_retries
          sleep 1
          retry
        else
          response = nil
        end
      end

      extract_api_data(response, @healthcheck_url)
    end

    def get_previous_time_interval(time_of_interest)
      # Generate datetime to fetch based on when data is expected to be available
      # Hourly data should be scheduled for 10 minutes past the hour to give a buffer to CMC's claim
      # that hourly data updates 5 minutes after the hour
      # Similarly, daily data can probably be schedule at 1AM instead of midnight

      # The date should be one time interval before the actual run-time,
      # e.g., daily run at Jan 2, 2019 0:10 UTC will run with start date of Jan 1, 2019
      # Caveat: If triggered manually, execution time can be today
      # In this case, set previous_interval to most recent, available data

      previous_interval = time_of_interest.new_offset(0).beginning_of_day
      start_of_today = DateTime.current.beginning_of_day
      if previous_interval >= start_of_today
        previous_interval = previous_interval - 1.day
      end
      previous_interval
    end
  end
end
