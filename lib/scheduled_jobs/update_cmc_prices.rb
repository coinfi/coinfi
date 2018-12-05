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
      CoinMarketCapPro::UpdateTickerService.call(start: 1, limit: 100, healthcheck_url: ENV.fetch('HEALTHCHECK_SNAP_PRICES1'))
    when 2 # Top 101-200
      CoinMarketCapPro::UpdateTickerService.call(start: 101, limit: 100, healthcheck_url: ENV.fetch('HEALTHCHECK_SNAP_PRICES2'))
    when 3 # Top 201-500
      CoinMarketCapPro::UpdateTickerService.call(start: 201, limit: 300, healthcheck_url: ENV.fetch('HEALTHCHECK_SNAP_PRICES3'))
    when 4 # Top 501-1000
      CoinMarketCapPro::UpdateTickerService.call(start: 501, limit: 500, healthcheck_url: ENV.fetch('HEALTHCHECK_SNAP_PRICES4'))
    when 5 # Top 1001+
      CoinMarketCapPro::UpdateTickerService.call(start: 1001, limit: 5000, healthcheck_url: ENV.fetch('HEALTHCHECK_SNAP_PRICES5')) # 5000 is CMC's max limit
    end
  end
end