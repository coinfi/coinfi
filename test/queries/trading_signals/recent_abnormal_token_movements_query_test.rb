require 'test_helper'
require 'faker'

class TradingSignals::RecentAbnormalTokenMovementsQueryTest < ActiveSupport::TestCase
  test 'correctly filters with default values' do
    included_trading_signals = 3.times.map do
      timestamp = Faker::Time.between(23.hours.ago, 5.minutes.ago, :between)
      create(:token_exchange_transactions_trading_signal, timestamp: timestamp)
    end
    excluded_trading_signals = 3.times.map do
      timestamp = Faker::Time.between(5.days.ago, 25.hours.ago, :between)
      create(:token_exchange_transactions_trading_signal, timestamp: timestamp)
    end

    actual_trading_signals = TradingSignals::RecentAbnormalTokenMovementsQuery.call()
    assert_equal included_trading_signals.sort_by(&:id), actual_trading_signals.sort_by(&:id)
  end

  test 'correctly filters with custom `time_window`' do
    included_trading_signals = 3.times.map do
      timestamp = Faker::Time.between(2.hours.ago, 5.minutes.ago, :between)
      create(:token_exchange_transactions_trading_signal, timestamp: timestamp)
    end
    excluded_trading_signals = 3.times.map do
      timestamp = Faker::Time.between(1.day.ago, 4.hours.ago, :between)
      create(:token_exchange_transactions_trading_signal, timestamp: timestamp)
    end

    actual_trading_signals = TradingSignals::RecentAbnormalTokenMovementsQuery.call(time_window: 3.hours)
    assert_equal included_trading_signals.sort_by(&:id), actual_trading_signals.sort_by(&:id)
  end
end
