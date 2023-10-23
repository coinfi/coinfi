require 'sidekiq-scheduler'
class UpdateCmcDailyPrices
  include Sidekiq::Worker

  def perform(metadata)
    scheduled_day = Time.at(metadata["scheduled_at"]).utc.beginning_of_day
    day_before_scheduled_day = scheduled_day - 1.day

    current_price_query = DailyOhclPrice.where(time: day_before_scheduled_day...scheduled_day)
    if current_price_query.count > 0
      coin_ids = Coin.where.not(cmc_id: nil).
        where.not(id: current_price_query.select(:coin_id).distinct).
        pluck(:id)

      if coin_ids.empty?
        puts "Prices available for all coins. Skipping OHCL update."
        return
      end
    else
      coin_ids = nil
    end

    CoinMarketCapPro::UpdateOhclService.call(
      coin_ids: coin_ids,
      start_date: day_before_scheduled_day.to_datetime,
      healthcheck_url: ENV.fetch('HEALTHCHECK_DAILY_PRICES')
    )

    check_results = CheckCmcOhclvService.call(granularity: 'daily', check_time: day_before_scheduled_day)
    if check_results.failed_coins.present? || check_results.failed_cached_coins.present?
      raise "Failed CMC OHCLV Checks"
    end
  end
end