require 'sidekiq-scheduler'
class UpdateCmcDailyPrices
  include Sidekiq::Worker

  def perform(metadata)
    day_before = Time.at(metadata["scheduled_at"]).utc.beginning_of_day - 1.day

    CoinMarketCapPro::UpdateOhclService.call(
      start_date: day_before.to_datetime,
      healthcheck_url: ENV.fetch('HEALTHCHECK_DAILY_PRICES')
    )

    CheckCmcOhclvService.call(granularity: 'daily')
  end
end