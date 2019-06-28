require 'sidekiq-scheduler'

# Initial requirements: https://app.asana.com/0/902343675126966/892701094146974
class UpdateCmcMarketPairs
  include Sidekiq::Worker

  # Scheduling has been split up to result in:
  # normal request rate of 65-70 requests / minute
  # max request rate of 90 requests (on a 3 minute cadence)
  #
  # NOTES
  #
  # - Offset and frequency/times were chosen somewhat arbitrarily to find
  #   easily divisible numbers that still more or less result in the original requirements
  # - Different modulo remainders were used to offset when updates are performed
  def perform(metadata)
    scheduled_at = Time.at(metadata["scheduled_at"])
    minutes = scheduled_at.min
    hours = scheduled_at.hour

    # 20 requests / minute
    if (minutes % 2 == 0) # Top 0-19; every 2 minutes
      perform_update(1)
    else # Top 20-99; every 2 minutes, full cycle of 6 minutes
      sub_index = (minutes / 2) % 3
      perform_update(2, sub_index)
    end

    # 20 requests / minute
    if minutes % 3 == 0 # Top 100-199; every 3 minutes, full cycle of 15 minutes
      sub_index = (minutes / 3) % 5
      perform_update(3, sub_index)
    elsif minutes % 6 == 1 # Top 200-299; every 6 minutes, full cycle of 30 minutes
      sub_index = (minutes / 6) % 5
      perform_update(4, sub_index)
    elsif minutes % 6 == 2 # Top 300-499; every 6 minutes, full cycle of 60 minutes
      sub_index = (minutes / 6) % 10
      perform_update(5, sub_index)
    end

    # 25-30 requests / minute
    if minutes % 12 == 0 # Top 500-749; every 12 minutes, full cycle of 1 hour
      sub_index = (minutes / 12) % 5
      perform_update(6, sub_index)
    end
    two_hour_cycle = hours % 2 * 60 + minutes
    if two_hour_cycle % 12 == 1 # Top 750-999; every 12 minutes, full cycle of 2 hours
      sub_index = (two_hour_cycle / 12) % 10
      perform_update(7, sub_index)
    end
    four_hour_cycle = hours % 4 * 60 + minutes
    if four_hour_cycle % 12 == 2 # Top 1000-1499; every 12 minutes, full cycle of 4 hours
      sub_index = (four_hour_cycle / 12) % 20
      perform_update(8, sub_index)
    end
    # 25 requests / 3 minutes with blank periods due to unknown coin limit
    six_hour_cycle = hours % 6 * 60 + minutes
    if six_hour_cycle % 3 == 1 # Top 1500-4499; every 3 minutes, full cycle of 6 hours
      sub_index = (six_hour_cycle / 3) % 120
      perform_update(9, sub_index)
    end
  end

  def perform_update(index, sub_index = nil)
    case index
    when 1 # Top 0-19
      CoinMarketCapPro::UpdateMarketPairsService.call(start: 0, limit: 20)
    when 2 # Top 20-99 (%3)
      limit = 26
      offset = sub_index * limit
      # increasing limit for final group to deal with unevenly sized groups, (99-20+1)/3=26.6666
      if sub_index == 2 then limit += 2 end
      CoinMarketCapPro::UpdateMarketPairsService.call(start: 20 + offset, limit: limit)
    when 3 # Top 100-199 (%5)
      limit = 20
      offset = sub_index * limit
      CoinMarketCapPro::UpdateMarketPairsService.call(start: 100 + offset, limit: limit)
    when 4 # Top 200-299 (%5)
      limit = 20
      offset = sub_index * limit
      CoinMarketCapPro::UpdateMarketPairsService.call(start: 200 + offset, limit: limit)
    when 5 # Top 300-499 (%10)
      limit = 20
      offset = sub_index * limit
      CoinMarketCapPro::UpdateMarketPairsService.call(start: 300 + offset, limit: limit)
    when 6 # Top 500-749 (%5)
      limit = 50
      offset = sub_index * limit
      CoinMarketCapPro::UpdateMarketPairsService.call(start: 500 + offset, limit: limit)
    when 7 # Top 750-999 (%10)
      limit = 25
      offset = sub_index * limit
      CoinMarketCapPro::UpdateMarketPairsService.call(start: 750 + offset, limit: limit)
    when 8 # Top 1000-1499 (%20)
      limit = 25
      offset = sub_index * limit
      CoinMarketCapPro::UpdateMarketPairsService.call(start: 1000 + offset, limit: limit)
    when 9 # Top 1500-4499 (%120)
      limit = 25
      offset = sub_index * limit
      CoinMarketCapPro::UpdateMarketPairsService.call(start: 1500 + offset, limit: limit)
    end
  end
end