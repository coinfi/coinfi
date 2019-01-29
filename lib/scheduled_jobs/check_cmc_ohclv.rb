require 'sidekiq-scheduler'

class CheckCmcOhclv
  include Sidekiq::Worker

  def perform(metadata)
    scheduled_at = Time.at(metadata["scheduled_at"]).utc
    hours = scheduled_at.hour

    # Check daily @ 1am UTC
    if hours == 1
      CheckCmcOhclvService.call(granularity: 'daily')
    end

    # CMC Hourly data is not yet being ingested. Enable once available
    # CheckCmcOhclvService.call(granularity: 'hourly')
  end
end