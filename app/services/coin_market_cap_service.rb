require_relative '../../lib/tasks/batch_process'

class CoinMarketCapService
  attr_accessor :failed_updates

  def initialize
    @failed_updates = []
  end

  def supply_update
    coins = load_northpole_ticker_data
    batch_process(coins) do |coin|
      identifier = coin['identifier']
      update_coin_supply(identifier, coin)
    end
    log_failed_updates
  end

  def ticker_update(start = 0, limit = 100)
    coins = load_cmc_latest_data(start, limit)
    batch_process(coins) do |coin|
      identifier = coin['slug']
      update_coin_prices(identifier, coin)
    end
    log_failed_updates
  end

  private

  def log_failed_updates
    @failed_updates.sort! { |left, right| left[:ranking] <=> right[:ranking] }
    @failed_updates.each do |update|
      Rails.logger.info "MISSING COIN: Rank #{update[:ranking]} #{update[:identifier]} coin from CMC is missing from the `coins` table."
    end
  end

  def update_coin_prices(identifier, data)
    coin = Coin.find_by(slug: identifier)
    if !coin
      @failed_updates << { identifier: identifier, ranking: data['cmc_rank'] }
    else
      perform_update_prices(coin, data)
    end
  end

  def update_coin_supply(identifier, data)
    coin = Coin.find_by(slug: identifier)
    if !coin
      @failed_updates << { identifier: identifier, ranking: data['position'].to_i }
    else
      perform_update(coin, data)
    end
  end

  def perform_update_prices(coin, data)
    quote = data.dig("quote", "USD")
    coin_hash = {
      :price => quote["price"],
      :market_cap => quote["market_cap"],
      :volume24h => quote["volume_24h"],
      :change1h => quote["percent_change_1h"],
      :change24h => quote["percent_change_24h"],
      :change7d => quote["percent_change_7d"],
      :total_supply => data["total_supply"],
      :available_supply => data['circulating_supply'],
      :max_supply => data['max_supply'],
      :last_retrieved => Time.now.utc.to_s,
    }
    Rails.cache.write("#{data['slug']}:snapshot", coin_hash)

    coin.update(
      ranking: data['cmc_rank'],
      last_synced: data['last_updated'],
      ico_status: 'listed'
    )
  end

  def perform_update_supply(coin, data)
    coin.update(
      ranking: data['position'],
      market_cap: data['marketCap'],
      price: data['price'],
      volume24: data['volume24'],
      change24h: data['change24h'],
      change1h: data['change1h'],
      change7d: data['change7d'],
      last_synced: data['timestamp'],
      ico_status: 'listed'
    )
  end

  def load_northpole_ticker_data
    ticker_url = 'http://coinmarketcap.northpole.ro/ticker.json?identifier=&version=v8'
    response = HTTParty.get(ticker_url)
    contents = JSON.parse(response.body)

    contents['markets']
  end

  def load_cmc_latest_data(start, limit)
    # ticker_url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/info"
    # query = { :start => start, :limit => limit }
    # headers = { "X-CMC_PRO_API_KEY" => ENV.fetch('COINMARKETCAP_API_KEY') }
    # response = HTTParty.get(ticker_url, :query => query, :headers => headers)
    # contents = JSON.parse(response.body)

    contents = JSON.parse('{
      "data": [
      {
      "id": 1,
      "name": "Bitcoin",
      "symbol": "BTC",
      "slug": "bitcoin",
      "cmc_rank": 1,
      "num_market_pairs": 500,
      "circulating_supply": 16950100,
      "total_supply": 16950100,
      "max_supply": 21000000,
      "last_updated": "2018-06-02T22:51:28.209Z",
      "date_added": "2013-04-28T00:00:00.000Z",
      "quote": {
      "USD": {
      "price": 9283.92,
      "volume_24h": 7155680000,
      "percent_change_1h": -0.152774,
      "percent_change_24h": 0.518894,
      "percent_change_7d": 0.986573,
      "market_cap": 158055024432,
      "last_updated": "2018-08-09T22:53:32.000Z"
      },
      "BTC": {
      "price": 1,
      "volume_24h": 772012,
      "percent_change_1h": 0,
      "percent_change_24h": 0,
      "percent_change_7d": 0,
      "market_cap": 17024600,
      "last_updated": "2018-08-09T22:53:32.000Z"
      }
      }
      }
      ],
      "status": {
      "timestamp": "2018-06-02T22:51:28.209Z",
      "error_code": 0,
      "error_message": "",
      "elapsed": 10,
      "credit_count": 1
      }
    }')

    # ping health check if no data

    contents['data']
  end
end
