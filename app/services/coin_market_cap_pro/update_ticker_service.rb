require_relative '../../../lib/tasks/batch_process'

module CoinMarketCapPro
  class UpdateTickerService < Patterns::Service
    include CoinMarketCapProHelpers
    include CoinListHelper
    attr_reader :db_missing_coins
    attr_reader :cmc_missing_data

    def initialize(start: 1, limit: 100, healthcheck_url: nil) # 1-indexed
      @db_missing_coins = []
      @cmc_missing_data = []
      @start = start
      @limit = limit
      @healthcheck_url = healthcheck_url
    end

    def call
      cmc_coins = load_cmc_latest_data(@start, @limit)
      unless cmc_coins.nil?
        cmc_coin_dict = cmc_coins.inject(Hash.new) do |dict, cmc_coin|
          identifier = cmc_coin['id']
          dict[identifier] = cmc_coin if identifier.present?
          dict
        end
        coin_identifiers = cmc_coin_dict.keys

        coins_to_process = Coin.where(cmc_id: coin_identifiers)
        progress = ProgressBar.create(:title => 'coins', :total => coins_to_process.count)
        coins_to_process.find_in_batches do |coins|
          coins.each do |coin|
            identifier = coin.cmc_id
            cmc_coin = cmc_coin_dict[identifier] if identifier.present?
            update_coin_prices(identifier, cmc_coin, coin) if cmc_coin.present?
            progress.increment
          end
        end
        log_db_missing_coins
        log_or_ping_on_missing_data(@cmc_missing_data, @healthcheck_url)
      end
    end

    private

    def log_db_missing_coins
      @db_missing_coins.sort! { |left, right| (left[:ranking] || Float::INFINITY) <=> (right[:ranking] || Float::INFINITY) }
      @db_missing_coins.each do |coin_hash|
        puts "WARNING - MISSING COIN: Rank #{coin_hash[:ranking]} #{coin_hash[:identifier]} coin from CMC is missing from the `coins` table."
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

    def update_coin_prices(identifier, data, coin)
      if has_missing_data(data)
        @cmc_missing_data << { identifier: identifier, data: data }
      else
        perform_update_prices(data)
      end

      perform_update_ranking(coin, data)
      if is_toplist_coin?(coin)
        puts "Refreshing toplist"
        toplist_coins(force_cache_refresh: true)
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
      last_synced = begin
        DateTime.parse(data['last_updated']).to_i
      rescue ArgumentError
        DateTime.now.utc.to_i
      end

      coin.update(
        name: data['name'],
        symbol: data['symbol'],
        # slug: data['slug'], # maybe don't update this frequently to avoid url changing
        ranking: data['cmc_rank'],
        last_synced: last_synced,
        is_listed: coin.coin_key.present? ? true : false # avoid listing entries without a coin key
      )
    end

    def load_cmc_latest_data(start, limit)
      ticker_url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"
      query = { :start => start, :limit => limit }
      headers = get_default_api_headers
      response = begin
        HTTParty.get(ticker_url, :query => query, :headers => headers)
      rescue HTTParty::Error
        nil
      end

      extract_api_data(response, @healthcheck_url)
    end
  end
end