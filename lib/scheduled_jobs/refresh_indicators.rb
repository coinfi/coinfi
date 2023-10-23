require 'sidekiq-scheduler'

class RefreshIndicators
  include Sidekiq::Worker

  def perform(metadata)
    scheduled_day = if metadata.present?
      Time.at(metadata["scheduled_at"]).utc.beginning_of_day
    else
      Time.current.beginning_of_day
    end

    # Ensure current CMC data is present before updating indicators
    day_before_scheduled_day = scheduled_day - 1.day
    check_results = CheckCmcOhclvService.call(granularity: 'daily', check_time: day_before_scheduled_day)
    if check_results.failed_coins.present? || check_results.failed_cached_coins.present?
      raise "Failed CMC OHCLV Checks"
    end

    CoinServices::UpdateIndicatorData.call
  end
end