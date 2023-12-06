require 'sidekiq-scheduler'
class UpdateCmcPrices
  include Sidekiq::Worker

  # This makes up to 5 API calls per minute
  def perform(metadata)
    minutes = Time.at(metadata["scheduled_at"]).min
    update_prices(minutes)
  end

  # 8,064 credits/day
  # 1,440 credits (1 credit/minute)
  # 1,440 credits (2 credits/2 minutes)
  # 1,440 credits (3 credits/3 minutes)
  # 1,440 (5 credits/5 minutes)
  # 2,304 (~24 credits/15 minutes)
  def update_prices(minutes)
    # Top 1-100
    if minutes % 1 == 0 # Redundant, but done for uniformity
      CoinMarketCapPro::UpdateTickerService.call(start: 1, limit: 100, healthcheck_url: ENV.fetch('HEALTHCHECK_SNAP_PRICES1'))
    end

    # Top 101-300
    if minutes % 2 == 0
      CoinMarketCapPro::UpdateTickerService.call(start: 101, limit: 200, healthcheck_url: ENV.fetch('HEALTHCHECK_SNAP_PRICES2'))
    end

    # Top 301-600
    if minutes % 3 == 0
      CoinMarketCapPro::UpdateTickerService.call(start: 301, limit: 300, healthcheck_url: ENV.fetch('HEALTHCHECK_SNAP_PRICES3'))
    end

    # Top 601-1100
    if minutes % 5 == 0
      CoinMarketCapPro::UpdateTickerService.call(start: 601, limit: 500, healthcheck_url: ENV.fetch('HEALTHCHECK_SNAP_PRICES4'))
    end

    # Top 1101+
    if minutes % 15 == 0
      CoinMarketCapPro::UpdateTickerService.call(start: 1101, limit: 5000, healthcheck_url: ENV.fetch('HEALTHCHECK_SNAP_PRICES5')) # 5000 is CMC's max limit
    end
  end
end