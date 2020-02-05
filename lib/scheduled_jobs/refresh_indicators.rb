require 'sidekiq-scheduler'

class RefreshIndicators
  include Sidekiq::Worker

  def perform
    CoinServices::UpdateIndicatorData.call
  end
end