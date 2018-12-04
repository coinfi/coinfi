require 'sidekiq-scheduler'
class CacheRefreshSparkline
  include Sidekiq::Worker

  #Refresh Sparkline Chart Data Cache
  def perform
    Coin.legit.find_each do |coin|
      coin.sparkline
    end
  end
end