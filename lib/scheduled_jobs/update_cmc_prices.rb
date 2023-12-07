require 'sidekiq-scheduler'
class UpdateCmcPrices
  include Sidekiq::Worker

  # This makes up to 5 API calls per minute
  def perform(metadata)
    minutes = Time.at(metadata["scheduled_at"]).min
    update_prices(minutes)
  end

  def update_prices(minutes)
    start = 1
    updates_to_perform.each.with_index(1) do |update, index|
      if minutes % update[:minutes] == 0
        CoinMarketCapPro::UpdateTickerService.call(
          start: start,
          limit: update[:coins],
          healthcheck_url: ENV.fetch("HEALTHCHECK_SNAP_PRICES#{index}")
        )
      end
      start += update[:coins]
    end
  end

  # 7,584 credits/day
  # 1,440 credits (1 credit/minute)
  # 720 credits (1 credits/2 minutes)
  # 960 credits (2 credits/3 minutes)
  # 864 (3 credits/5 minutes)
  # 3,600 (25 credits/10 minutes)
  def updates_to_perform
    [
      {
        minutes: 1,
        coins: 200,
      },
      {
        minutes: 2,
        coins: 200,
      },
      {
        minutes: 3,
        coins: 400,
      },
      {
        minutes: 5,
        coins: 600,
      },
      {
        minutes: 10,
        coins: 5000,
      },
    ]
  end
end