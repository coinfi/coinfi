require_relative '../../lib/tasks/batch_process'

class CoinMarketCapService
  attr_accessor :failed_updates

  def initialize
    @failed_updates = []
  end

  def ticker_update
    data = load_cmc_ticker_data
    batch_process(coins(data)) do |coin|
      identifier = coin['identifier']
      update_coin(identifier, coin)
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

  def update_coin(identifier, data)
    coin = Coin.find_by(slug: identifier)
    if !coin
      @failed_updates << { identifier: identifier, ranking: data['position'].to_i }
    else
      perform_update(coin, data)
    end
  end

  def perform_update(coin, data)
    coin.update(
      ranking: data['position'],
      market_cap: data['marketCap'],
      price: data['price'],
      volume24: data['volume24'],
      available_supply: data['availableSupply'],
      change24h: data['change24h'],
      change1h: data['change1h'],
      change7d: data['change7d'],
      last_synced: data['timestamp'],
      ico_status: 'listed'
    )
  end

  def coins(data)
    data['markets']
  end

  def load_cmc_ticker_data
    ticker_url = 'http://coinmarketcap.northpole.ro/ticker.json?identifier=&version=v8'
    response = HTTParty.get(ticker_url)
    JSON.parse(response.body)
  end
end
