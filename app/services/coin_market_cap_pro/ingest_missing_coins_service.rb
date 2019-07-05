module CoinMarketCapPro
  class IngestMissingCoinsService < Patterns::Service
    include CoinMarketCapProHelpers
    include ::SlackHelpers

    CMC_LIMIT = 5000
    PAPERTRAIL_PREFIX = '[CMC]'

    def initialize(top_coins: 500)
      @top_coins = top_coins <= CMC_LIMIT ? top_coins : CMC_LIMIT
      @db_coins = Coin.top(@top_coins)
      @missing_cmc_ids = []
      @inserted_coins = []
      @duplicate_coins = []
      @failed_coins = []

      @slack_channel = fetch_slack_channel_from_env('SLACK_CHANNEL_MISSING_COINS')
    end

    def call
      @missing_cmc_ids = find_missing_cmc_ids
      metadata = fetch_cmc_metadata(@missing_cmc_ids)

      @missing_cmc_ids.each do |cmc_id|
        coin_metadata = metadata[cmc_id.to_s]
        if coin_metadata.blank?
          @failed_coins << {
            cmc_id: cmc_id,
            error: "Could not fetch metadata from CMC."
          }
          next
        end

        cmc_coin = extract_coin_data_from_metadata(coin_metadata)
        duplicate_coins = find_possible_duplicate_coins(cmc_coin)

        if duplicate_coins.blank?
          # Modify cmc_coin for insertion into DB
          cmc_coin[:is_listed] = false
          cmc_coin[:description] = coin_metadata['description'] if coin_metadata['description'].present?
          if cmc_coin[:coin_key].present? && cmc_coin[:coin_key].instance_of?(Array)
            cmc_coin[:coin_key] = cmc_coin[:coin_key][0]
          end

          begin
            inserted_coin = Coin.create!(cmc_coin)
            @inserted_coins << coin_serializer(inserted_coin)
          rescue ActiveRecord::RecordNotUnique => e
            cmc_coin[:error] = e
            @failed_coins << cmc_coin
          end
        else
          duplicates = duplicate_coins.map {|coin| coin_serializer(coin)}
          duplicate_coin_report = {
            coin: coin_metadata,
            duplicates: duplicates,
          }
          @duplicate_coins << duplicate_coin_report
        end
      end

      report_to_slack
      log_to_papertrail
    end

    private

    def find_missing_cmc_ids
      @cmc_coins = fetch_cmc_coins

      cmc_ids = @cmc_coins.map {|coin| coin['id']}
      db_cmc_ids = @db_coins.pluck(:cmc_id).compact
      missing_cmc_ids = cmc_ids - db_cmc_ids
    end

    def find_possible_duplicate_coins(cmc_coin)
      possible_coins = Coin.none

      cmc_coin.each do |key, value|
        possible_coins = possible_coins.or(Coin.where(key.to_sym => value))
      end

      possible_coins
    end

    def fetch_cmc_coins
      api_url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map"
      query = { limit: @top_coins }
      headers = get_default_api_headers
      response = begin
        HTTParty.get(api_url, :query => query, :headers => headers)
      rescue HTTParty::Error
        nil
      end

      extract_api_data(response)
    end

    def fetch_cmc_metadata(cmc_ids)
      api_url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/info"
      id_string = cmc_ids.join(",")
      query = { id: id_string }
      headers = get_default_api_headers
      response = begin
        HTTParty.get(api_url, :query => query, :headers => headers)
      rescue HTTParty::Error
        nil
      end

      extract_api_data(response)
    end

    def extract_coin_data_from_metadata(coin_metadata)
      coin_keys = nil
      website = coin_metadata.dig('urls', 'website', 0)
      if website.present?
        website_uri = URI(website.chomp('/'))
        coin_keys = [website_uri.host]
        if website_uri.path.present?
          coin_keys << "#{website_uri.host}#{website_uri.path}"
        end
      end

      cmc_coin = {
        coin_key: coin_keys,
        website: website,
        slug: coin_metadata['slug'],
        symbol: coin_metadata['symbol'],
        name: coin_metadata['name'],
        cmc_id: coin_metadata['id'],
        twitter: coin_metadata.dig('urls', 'twitter', 0),
        reddit: coin_metadata.dig('urls', 'reddit', 0),
        github: coin_metadata.dig('urls', 'source_code', 0),
        image_url: coin_metadata['logo']
      }.compact
    end

    def coin_serializer(coin)
      {
        id: coin.id,
        coin_key: coin.coin_key,
        slug: coin.slug,
        symbol: coin.symbol,
        name: coin.name,
        cmc_id: coin.cmc_id,
      }
    end

    def report_to_slack
      slack_report = ""

      if @missing_cmc_ids.respond_to?(:size)
        slack_report += <<~TEXT
          Found #{@missing_cmc_ids.size} potentially missing coins from CMC out of top #{@top_coins} coins.
          CMC IDs:
          ```#{@missing_cmc_ids}```
        TEXT
      end
      slack_report += "*INSERTED:* #{@inserted_coins.size}\n" if @inserted_coins.respond_to?(:size)
      slack_report += "*POSSIBLE DUPLICATES:* #{@duplicate_coins.size}\n" if @duplicate_coins.respond_to?(:size)
      slack_report += "*FAILED:* #{@failed_coins.size}\n" if @failed_coins.respond_to?(:size)

      if slack_report.present?
        send_slack_message(channel: @slack_channel, message: slack_report)
      else
        send_slack_message(channel: @slack_channel, message: "No missing coins for top #{@top_coins} coins on CMC!")
      end
    end

    def log_to_papertrail
      if @missing_cmc_ids.present?
        puts <<~TEXT
          #{PAPERTRAIL_PREFIX} Found #{@missing_cmc_ids.size} potentially missing coins from CMC out of #{@top_coins} top coins.
          #{PAPERTRAIL_PREFIX} CMC IDs: #{@missing_cmc_ids}
        TEXT
      end

      if @inserted_coins.present?
        puts "#{PAPERTRAIL_PREFIX} ***** INSERTED #{@inserted_coins.size} COINS *****"
        @inserted_coins.each do |coin|
          puts format_inserted_coin(coin)
        end
      end

      if @duplicate_coins.present?
        puts"#{PAPERTRAIL_PREFIX} ***** #{@duplicate_coins.size} POSSIBLE DUPLICATE COINS *****"
        @duplicate_coins.each do |coin|
          puts format_duplicate_coin(coin)
        end
      end

      if @failed_coins.present?
        puts "#{PAPERTRAIL_PREFIX} ***** #{@failed_coins.size} FAILED COINS *****"
        @failed_coins.each do |coin|
          puts format_failed_coin(coin)
        end
      end
    end

    def format_inserted_coin(coin)
      output_text = "Inserted:\n"
      JSON.pretty_generate(coin).each_line do |line|
        output_text += "#{PAPERTRAIL_PREFIX} #{line}\n"
      end
      output_text
    end

    def format_duplicate_coin(report)
      cmc_coin = report[:coin]
      duplicate_coins = report[:duplicates]

      output_text = "CMC Coin:\n"
      JSON.pretty_generate(cmc_coin).each_line do |line|
        output_text += "#{PAPERTRAIL_PREFIX} #{line}"
      end

      output_text += "Possible Duplicates:\n"
      duplicate_coins.each do |coin|
        JSON.pretty_generate(coin).each_line do |line|
          output_text += "#{PAPERTRAIL_PREFIX} #{line}"
        end
      end
      output_text
    end

    def format_failed_coin(coin)
      temp_coin = coin.dup
      error_message = temp_coin[:error]
      temp_coin.delete(:error)

      output_text = "#{error_message}\n"
      JSON.pretty_generate(temp_coin).each_line do |line|
        output_text += "#{PAPERTRAIL_PREFIX} #{line}"
      end
      output_text
    end
  end
end