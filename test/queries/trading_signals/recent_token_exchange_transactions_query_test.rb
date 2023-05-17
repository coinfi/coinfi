require 'test_helper'
require 'faker'

class TradingSignals::RecentTokenExchangeTransactionsQueryTest < ActiveSupport::TestCase
  test 'correctly filters with default values' do
    included_trading_signals = 3.times.map do
      timestamp = Faker::Time.between(from: 23.hours.ago, to: 5.minutes.ago)
      create(:token_exchange_transactions_trading_signal, timestamp: timestamp)
    end
    excluded_trading_signals = 3.times.map do
      timestamp = Faker::Time.between(from: 5.days.ago, to: 25.hours.ago)
      create(:token_exchange_transactions_trading_signal, timestamp: timestamp)
    end

    actual_trading_signals = TradingSignals::RecentTokenExchangeTransactionsQuery.call()
    assert_equal included_trading_signals.sort_by(&:id), actual_trading_signals.sort_by(&:id)
  end

  test 'correctly filters with custom `time_window`' do
    included_trading_signals = 3.times.map do
      timestamp = Faker::Time.between(from: 2.hours.ago, to: 5.minutes.ago)
      create(:token_exchange_transactions_trading_signal, timestamp: timestamp)
    end
    excluded_trading_signals = 3.times.map do
      timestamp = Faker::Time.between(from: 1.day.ago, to: 4.hours.ago)
      create(:token_exchange_transactions_trading_signal, timestamp: timestamp)
    end

    actual_trading_signals = TradingSignals::RecentTokenExchangeTransactionsQuery.call(time_window: 3.hours)
    assert_equal included_trading_signals.sort_by(&:id), actual_trading_signals.sort_by(&:id)
  end
end
