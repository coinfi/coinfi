require_relative '../../../lib/tasks/batch_process'

module CoinMarketCapPro
  class UpdateTickerService < Patterns::Service
    include CoinMarketCapProHelpers
    attr_accessor :db_missing_coins
    attr_accessor :cmc_missing_data

    def initialize(start: 1, limit: 100, healthcheck_url: nil) # 1-indexed
      @db_missing_coins = []
      @cmc_missing_data = []
      @start = start
      @limit = limit
      @healthcheck_url = healthcheck_url
    end

    def call
      coins = load_cmc_latest_data(@start, @limit)
      unless coins.nil?
        batch_process(coins) do |coin|
          identifier = coin['slug']
          update_coin_prices(identifier, coin)
        end
        log_db_missing_coins
        log_missing_data
      end
    end

    private

    def log_db_missing_coins
      @db_missing_coins.sort! { |left, right| left[:ranking] <=> right[:ranking] }
      @db_missing_coins.each do |coin_hash|
        puts "WARNING - MISSING COIN: Rank #{coin_hash[:ranking]} #{coin_hash[:identifier]} coin from CMC is missing from the `coins` table."
      end
    end

    def log_missing_data
      if @cmc_missing_data.empty?
        Net::HTTP.get(URI.parse(@healthcheck_url)) unless @healthcheck_url.blank?
      else
        if @healthcheck_url.present?
          Net::HTTP.post(URI.parse("#{@healthcheck_url}/fail"), @cmc_missing_data.to_json)
        else
          pp @cmc_missing_data
        end
      end
    end

    def has_missing_data(data)
      quote = data.dig('quote', currency)
      added_at = if data['date_added'].present? then Time.parse(data['date_added']) else Time.now end
      updated_at = if quote['last_updated'].present? then Time.parse(quote['last_updated']) else Time.now end
      duration_in_seconds = updated_at - added_at
      # Include threshold; doesn't seem to have data at exactly 1h/24h/7d
      # Will need to empircally determine validity threshold
      has_1h = duration_in_seconds >= 1.5 * 24 * 60 * 60 # 1.5 days
      has_24h = duration_in_seconds >= 2 * 24 * 60 * 60 # 2 days
      has_7d = duration_in_seconds >= 8 * 24 * 60 * 60 # 8 days

      quote['price'].blank? || quote['market_cap'].blank? ||
        (has_1h && quote['percent_change_1h'].blank?) ||
        (has_24h && quote['percent_change_24h'].blank?) ||
        (has_7d && quote['percent_change_7d'].blank?)
    end

    def update_coin_prices(identifier, data)
      if has_missing_data(data)
        @cmc_missing_data << { identifier: identifier, data: data }
      else
        perform_update_prices(data)
      end

      coin = Coin.find_by(slug: identifier)
      if !coin
        @db_missing_coins << { identifier: identifier, ranking: data['cmc_rank'], id: data['id'] }
      else
        perform_update_ranking(coin, data)
      end
    end

    def perform_update_prices(data)
      quote = data.dig('quote', currency)
      coin_hash = {
        :price => quote['price'],
        :market_cap => quote['market_cap'],
        :volume24h => quote['volume_24h'] || 0,
        :change1h => quote['percent_change_1h'],
        :change24h => quote['percent_change_24h'],
        :change7d => quote['percent_change_7d'],
        :total_supply => data['total_supply'] || 0,
        :available_supply => data['circulating_supply'] || 0,
        :max_supply => data['max_supply'] || 0,
        :last_retrieved => Time.now.utc.to_s,
      }

      Rails.cache.write("#{data['slug']}:snapshot", coin_hash)
    end

    def perform_update_ranking(coin, data)
      coin.update(
        cmc_id: data['id'],
        ranking: data['cmc_rank'],
        last_synced: data['last_updated'],
        ico_status: 'listed'
      )
    end

    def load_cmc_latest_data(start, limit)
      ticker_url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"
      query = { :start => start, :limit => limit }
      headers = { "X-CMC_PRO_API_KEY" => ENV.fetch('COINMARKETCAP_API_KEY') }
      response = HTTParty.get(ticker_url, :query => query, :headers => headers)
      contents = JSON.parse(response.body)

      # ping health check if api error
      json_response_code = get_json_response_code(contents)

      if response.success? && json_response_code == 0 then
        Net::HTTP.get(URI.parse(@healthcheck_url)) unless @healthcheck_url.blank?
        return contents['data']
      else
        error_message = "ERROR HTTP(#{response.code}) JSON(#{json_response_code}): #{get_error_message(contents)}"
        if @healthcheck_url.present?
          Net::HTTP.post(URI.parse("#{@healthcheck_url}/fail"), error_message)
        else
          puts error_message
        end
        return nil
      end
    end
  end
end