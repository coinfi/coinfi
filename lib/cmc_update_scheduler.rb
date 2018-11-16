require 'sidekiq-scheduler'
class CmcUpdateScheduler
  include Sidekiq::Worker

  def perform(id)
    # Top 1-100
    case id
    when 1
      CoinMarketCapService.new.ticker_update(0, 100)
    when 2
      CoinMarketCapService.new.ticker_update(100, 100)
    when 3
      CoinMarketCapService.new.ticker_update(200, 300)
    when 4
      CoinMarketCapService.new.ticker_update(500, 500)
    when 5
      CoinMarketCapService.new.ticker_update(1000, 5000) # 5000 is CMC's max limit
    end
  end
end