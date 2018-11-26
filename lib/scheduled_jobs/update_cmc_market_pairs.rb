require 'sidekiq-scheduler'
class UpdateCmcMarketPairs
  include Sidekiq::Worker

  def perform(id)
    case id
    when 1 # Top 0-19
      CoinMarketCapPro::UpdatePairsService.call(0, 20)
    when 2 # Top 20-99
      CoinMarketCapPro::UpdatePairsService.call(20, 80)
    when 3 # Top 100-199
      CoinMarketCapPro::UpdatePairsService.call(100, 100)
    when 4 # Top 200-299
      CoinMarketCapPro::UpdatePairsService.call(200, 100)
    when 5 # Top 300-499
      CoinMarketCapPro::UpdatePairsService.call(300, 200)
    when 6 # Top 500-749
      CoinMarketCapPro::UpdatePairsService.call(500, 150)
    when 7 # Top 750-999
      CoinMarketCapPro::UpdatePairsService.call(750, 250)
    when 8 # Top 1000-1499
      CoinMarketCapPro::UpdatePairsService.call(1000, 500)
    when 9 # Top 1500+
      CoinMarketCapPro::UpdatePairsService.call(1500, 5000) # 5000 is CMC's max limit
    end
  end
end