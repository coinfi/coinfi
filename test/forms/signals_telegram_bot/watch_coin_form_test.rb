require 'test_helper'
require 'faker'

class SignalsTelegramBot::WatchCoinFormTest < ActiveSupport::TestCase
  setup do
    @coins = create_list(:coin, 3)
    @coin = @coins.first
    @signals_telegram_users = create_list(:signals_telegram_user, 3, :with_signals_telegram_subscriptions)
    @signals_telegram_user = @signals_telegram_users.first

    @default_form_params = {
      coin_symbol: @coin.symbol,
      signals_telegram_user: @signals_telegram_user,
    }
  end

  test 'valid' do
    form_params = @default_form_params
    form = SignalsTelegramBot::WatchCoinForm.new(form_params)

    assert form.valid?
  end

  test 'creates SignalsTelegramSubscription on save' do
    form_params = @default_form_params
    form = SignalsTelegramBot::WatchCoinForm.new(form_params)

    assert_difference 'SignalsTelegramSubscription.count', 1 do
      form.save!
    end
    assert_equal @default_form_params[:coin_symbol], form.service.signals_telegram_subscription.coin.symbol
    assert_equal @default_form_params[:signals_telegram_user], form.service.signals_telegram_subscription.signals_telegram_user
  end

  test 'invalid with empty `signals_telegram_user`' do
    form_params = @default_form_params.merge(signals_telegram_user: nil)
    form = SignalsTelegramBot::WatchCoinForm.new(form_params)

    refute form.valid?
    assert_includes form.errors.keys, :signals_telegram_user
  end

  test 'invalid with too many subscriptions' do
    max_watchlist_items = ENV.fetch('SIGNALS_MAX_WATCHLIST_ITEMS').to_i
    additional_subscriptions_count = max_watchlist_items - @signals_telegram_user.signals_telegram_subscriptions.count
    additional_subscriptions = create_list(
      :signals_telegram_subscription,
      additional_subscriptions_count,
      signals_telegram_user: @signals_telegram_user
    )

    form_params = @default_form_params
    form = SignalsTelegramBot::WatchCoinForm.new(form_params)

    refute form.valid?

    assert_includes form.errors.keys, :signals_telegram_subscriptions
    assert_equal(
      [{ error: :length, current: max_watchlist_items, maximum: max_watchlist_items }],
      form.errors.details[:signals_telegram_subscriptions]
    )
  end
end
