require 'sidekiq-scheduler'
class UpdateCmcPrices
  include Sidekiq::Worker

  def perform(metadata)
    minutes = Time.at(metadata["scheduled_at"]).min

    (1..5).each do |id|
      if (minutes % id == 0)
        perform_prices(id)
      end
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
end