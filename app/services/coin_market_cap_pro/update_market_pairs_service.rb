require_relative '../../../lib/tasks/batch_process'

module CoinMarketCapPro
  class UpdateMarketPairsService < Patterns::Service
    attr_accessor :cmc_missing_data

    def initialize(start: 0, limit: 20) # 0-indexed
      @cmc_missing_data = []
      @start = start
      @limit = limit
    end

    def call
      coins = Coin.top(@limit).offset(@start)
      batch_process(coins) do |coin|
        update_coin_pairs(coin)
      end
      log_missing_data
    end

    private

    def log_missing_data
      if @cmc_missing_data.empty?
        Net::HTTP.get(URI.parse(ENV.fetch('HEALTHCHECK_MARKET_PAIRS')))
      else
        Net::HTTP.post(URI.parse("#{ENV.fetch('HEALTHCHECK_MARKET_PAIRS')}/fail"), @cmc_missing_data.to_json)
      end
    end

    def update_coin_pairs(coin)
      data = coin.cmc_id ? load_cmc_pair_data(id: coin.cmc_id) : load_cmc_pair_data(symbol: coin.symbol)
      identifier = coin.slug
      perform_update_pairs(identifier, data)
    end

    def perform_update_pairs(identifier, data)
      snapshot = Rails.cache.read("#{identifier}:snapshot")
      base_volume24 = snapshot[:volume24h] unless snapshot.blank?

      raw_market_pairs = data.dig("market_pairs")
      market_pairs = raw_market_pairs.map do |pair|
        quote = pair.dig("quote", currency)
        volume_24h_quote =
        volume24 = quote["volume_24h"]
        {
          :exchange_name => pair.dig("exchange", "name"),
          :exchange_slug => pair.dig("exchange", "slug"),
          :pair => pair["market_pair"],
          :price => quote["price"],
          :volume24h => volume24,
          :volume_percentage => (volume24 / base_volume24 unless base_volume24.blank?),
          :volume24h_quote => pair.dig("quote", "exchange_reported", "volume_24h_quote"),
          :quote_currency_symbol => pair.dig("market_pair_quote", "currency_symbol"),
        }
      end

      coin_hash = {
        :total_pairs => data["num_market_pairs"],
        :market_pairs => market_pairs,
        :last_retrieved => Time.now.utc.to_s,
      }
      Rails.cache.write("#{identifier}:pairs", coin_hash)
    end

    def load_cmc_pair_data(id: nil, symbol: nil)
      return nil if id.nil? and symbol.nil?

      api_url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/market-pairs/latest"
      query = if id.nil? then { :symbol => symbol } else { :id => id } end
      headers = { "X-CMC_PRO_API_KEY" => ENV.fetch('COINMARKETCAP_API_KEY') }
      response = HTTParty.get(api_url, :query => query, :headers => headers)
      contents = JSON.parse(response.body)

      # ping health check if api error
      json_response_code = get_json_response_code(contents)

      if response.success? && json_response_code == 0 then
        Net::HTTP.get(URI.parse(ENV.fetch('HEALTHCHECK_MARKET_PAIRS')))
        return contents['data']
      else
        error_message = get_error_message(contents)
        Net::HTTP.post(URI.parse("#{ENV.fetch('HEALTHCHECK_MARKET_PAIRS')}/fail"), "ERROR HTTP(#{response.code}) JSON(#{json_response_code}): #{error_message}")
        return nil
      end
    end
  end
end