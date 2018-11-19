require 'sidekiq-scheduler'
class CmcUpdateScheduler
  include Sidekiq::Worker

  def perform(action, id)
    case action
    when 'prices'
      perform_prices(id)
    when 'pairs'
      perform_pairs(id)
    end
  end

  def perform_prices(id)
    case id
    when 1 # Top 1-100
      CoinMarketCapService.new.ticker_update(1, 100)
    when 2 # Top 101-200
      CoinMarketCapService.new.ticker_update(101, 100)
    when 3 # Top 201-500
      CoinMarketCapService.new.ticker_update(201, 300)
    when 4 # Top 501-1000
      CoinMarketCapService.new.ticker_update(501, 500)
    when 5 # Top 1001+
      CoinMarketCapService.new.ticker_update(1001, 5000) # 5000 is CMC's max limit
    end
  end

  def perform_pairs(id)
    case id
    when 1 # Top 0-19
      CoinMarketCapService.new.pairs_update(0, 20)
    when 2 # Top 20-99
      CoinMarketCapService.new.pairs_update(20, 80)
    when 3 # Top 100-199
      CoinMarketCapService.new.pairs_update(100, 100)
    when 4 # Top 200-299
      CoinMarketCapService.new.pairs_update(200, 100)
    when 5 # Top 300-499
      CoinMarketCapService.new.pairs_update(300, 200)
    when 6 # Top 500-749
      CoinMarketCapService.new.pairs_update(500, 150)
    when 7 # Top 750-999
      CoinMarketCapService.new.pairs_update(750, 250)
    when 8 # Top 1000-1499
      CoinMarketCapService.new.pairs_update(1000, 500)
    when 9 # Top 1500+
      CoinMarketCapService.new.pairs_update(1500, 5000) # 5000 is CMC's max limit
    end
  end
end