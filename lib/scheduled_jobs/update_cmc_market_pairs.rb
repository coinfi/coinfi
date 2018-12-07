require 'sidekiq-scheduler'
class UpdateCmcMarketPairs
  include Sidekiq::Worker

  def perform(id)
    case id
    when 1 # Top 0-19
      CoinMarketCapPro::UpdateMarketPairsService.call(start: 0, limit: 20)
    when 2 # Top 20-99
      CoinMarketCapPro::UpdateMarketPairsService.call(start: 20, limit: 80)
    when 3 # Top 100-199
      CoinMarketCapPro::UpdateMarketPairsService.call(start: 100, limit: 100)
    when 4 # Top 200-299
      CoinMarketCapPro::UpdateMarketPairsService.call(start: 200, limit: 100)
    when 5 # Top 300-499
      CoinMarketCapPro::UpdateMarketPairsService.call(start: 300, limit: 200)
    when 6 # Top 500-749
      CoinMarketCapPro::UpdateMarketPairsService.call(start: 500, limit: 150)
    when 7 # Top 750-999
      CoinMarketCapPro::UpdateMarketPairsService.call(start: 750, limit: 250)
    when 8 # Top 1000-1499
      CoinMarketCapPro::UpdateMarketPairsService.call(start: 1000, limit: 500)
    when 9 # Top 1500+
      CoinMarketCapPro::UpdateMarketPairsService.call(start: 1500, limit: 5000) # 5000 is CMC's max limit
    end
  end
end