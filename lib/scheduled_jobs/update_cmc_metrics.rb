require 'sidekiq-scheduler'
class UpdateCmcMetrics
  include Sidekiq::Worker

  def perform
    CoinMarketCapPro::UpdateMarketMetricsService.call
  end
end