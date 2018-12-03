require 'test_helper'
require 'faker'

class SignalsTelegramUsers::ForTradingSignalNotificationsQueryTest < ActiveSupport::TestCase
  setup do
    @signals_telegram_users = create_list(:signals_telegram_user, 3, :with_signals_telegram_subscriptions)
  end

  test 'correctly filters by `coin_key`' do
    @coin = create(:coin)
    create(:signals_telegram_subscription, coin: @coin, signals_telegram_user: @signals_telegram_users[0])
    create(:signals_telegram_subscription, coin: @coin, signals_telegram_user: @signals_telegram_users[2])
    expected_signal_telegram_users = [
      @signals_telegram_users[0],
      @signals_telegram_users[2]
    ]

    actual_signal_telegram_users = SignalsTelegramUsers::ForTradingSignalNotificationsQuery.call(coin_key: @coin.coin_key)

    actual_signal_telegram_users.each do |signals_telegram_user|
      assert_includes expected_signal_telegram_users, signals_telegram_user
    end
    assert_equal expected_signal_telegram_users.length, actual_signal_telegram_users.length
  end

  test 'correctly filters by throttled `trading_signal_external_id`' do
    trading_signal_trigger_external_id = 'btc-longs-dominate'
    excluded_signals_telegram_user = @signals_telegram_users.sample
    included_signals_telegram_users = @signals_telegram_users.reject {|stu| stu.id == excluded_signals_telegram_user.id}
    included_users = included_signals_telegram_users.map {|stu| stu.user}
    trading_signal_trigger = create(:trading_signal_trigger, external_id: trading_signal_trigger_external_id)

    # Create several old TradingSignals and associated TradingSignalNotifications that would be
    # outside the throttle window
    old_trading_signals = create_list(:trading_signal, 5,
      trading_signal_trigger: trading_signal_trigger,
      timestamp: 2.days.ago
    )
    old_trading_signal_notifications = 10.times.map do
      create(:trading_signal_notification,
        user: included_users.sample,
        trading_signal: old_trading_signals.sample,
      )
    end

    # Create a TradingSignal and associated TradingSignalNotifications that would be within the
    # throttle window and apply this to one user
    recent_trading_signal = create(:trading_signal,
      trading_signal_trigger: trading_signal_trigger,
      timestamp: 5.hours.ago
    )
    recent_trading_signal_notification = create(:trading_signal_notification,
      user: excluded_signals_telegram_user.user,
      trading_signal: recent_trading_signal
    )

    actual_signal_telegram_users = SignalsTelegramUsers::ForTradingSignalNotificationsQuery.call(trading_signal_trigger_external_id: trading_signal_trigger_external_id)

    assert_equal included_signals_telegram_users.length, actual_signal_telegram_users.length
    actual_signal_telegram_users.each do |signals_telegram_user|
      assert_includes included_signals_telegram_users, signals_telegram_user
    end
  end
end
