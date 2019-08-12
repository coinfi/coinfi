require 'sidekiq-scheduler'

class UpdateIndicatorStats
  include Sidekiq::Worker

  def perform
    CoinServices::UpdateIndicatorStats.call
  end
end