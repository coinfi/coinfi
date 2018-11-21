require 'sidekiq-scheduler'
class UpdateCmcMarketPairs
  include Sidekiq::Worker

  def perform(id)
    perform_pairs(id)
  end

  def perform_pairs(id)
    case id
    when 1 # Top 0-19
      CoinMarketCapProService.new.pairs_update(0, 20)
    when 2 # Top 20-99
      CoinMarketCapProService.new.pairs_update(20, 80)
    when 3 # Top 100-199
      CoinMarketCapProService.new.pairs_update(100, 100)
    when 4 # Top 200-299
      CoinMarketCapProService.new.pairs_update(200, 100)
    when 5 # Top 300-499
      CoinMarketCapProService.new.pairs_update(300, 200)
    when 6 # Top 500-749
      CoinMarketCapProService.new.pairs_update(500, 150)
    when 7 # Top 750-999
      CoinMarketCapProService.new.pairs_update(750, 250)
    when 8 # Top 1000-1499
      CoinMarketCapProService.new.pairs_update(1000, 500)
    when 9 # Top 1500+
      CoinMarketCapProService.new.pairs_update(1500, 5000) # 5000 is CMC's max limit
    end
  end
end