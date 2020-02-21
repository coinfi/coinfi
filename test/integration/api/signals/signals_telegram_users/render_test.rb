require 'application_integration_test'
require 'test_helper'
require_relative '../base_test'

module Api::Signals::SignalsTelegramUsers
  class RenderTest < Api::Signals::BaseTest
    test "register when valid" do
      unregistered_user = create(:user, :with_confirmed_signals_reservation)
      telegram_id = Faker::Number.number(digits: 9)
      telegram_username = unregistered_user.token_sale['telegram_username']
      telegram_chat_id = Faker::Number.number(digits: 9)
      started_at = 1.hour.ago

      request_params = {
        signals_telegram_user: {
          telegram_id: telegram_id,
          telegram_username: telegram_username,
          telegram_chat_id: telegram_chat_id,
          started_at: started_at.iso8601,
        }
      }
      post "/api/signals/signals_telegram_users/register", params: request_params, headers: auth_headers, as: :json

      assert_equal 200, status
      unregistered_user.reload
      assert_not_nil unregistered_user.signals_telegram_user
      assert_equal telegram_id, unregistered_user.signals_telegram_user.telegram_id.to_i
      assert_equal telegram_username, unregistered_user.signals_telegram_user.telegram_username
      assert_equal telegram_chat_id, unregistered_user.signals_telegram_user.telegram_chat_id.to_i
      assert_equal started_at.utc.to_s, unregistered_user.signals_telegram_user.started_at.utc.to_s
    end

    test "signals_telegram_users when valid" do
      signals_telegram_users = create_list(:signals_telegram_user, 5, :with_signals_telegram_subscriptions)

      get "/api/signals/signals_telegram_users", headers: auth_headers

      assert_equal 200, status
      expected_ids = response.parsed_body.map { |x| x['id'] }
      signals_telegram_users.each do |signals_telegram_user|
        assert_includes expected_ids, signals_telegram_user.id
      end
    end

    test "signals_telegram_users when `is_active` is `true`" do
      active_signals_telegram_users = create_list(:signals_telegram_user, 3, :with_signals_telegram_subscriptions, is_active: true)
      inactive_signals_telegram_users = create_list(:signals_telegram_user, 2, :with_signals_telegram_subscriptions, is_active: false)

      get "/api/signals/signals_telegram_users?is_active=true", headers: auth_headers

      assert_equal 200, status
      expected_ids = response.parsed_body.map { |x| x['id'] }
      active_signals_telegram_users.each do |signals_telegram_user|
        assert_includes expected_ids, signals_telegram_user.id
      end
      inactive_signals_telegram_users.each do |signals_telegram_user|
        assert_not_includes expected_ids, signals_telegram_user.id
      end
    end

    test "signals_telegram_users when `is_active` is `false`" do
      active_signals_telegram_users = create_list(:signals_telegram_user, 3, :with_signals_telegram_subscriptions, is_active: true)
      inactive_signals_telegram_users = create_list(:signals_telegram_user, 2, :with_signals_telegram_subscriptions, is_active: false)

      get "/api/signals/signals_telegram_users?is_active=false", headers: auth_headers

      assert_equal 200, status
      expected_ids = response.parsed_body.map { |x| x['id'] }
      active_signals_telegram_users.each do |signals_telegram_user|
        assert_not_includes expected_ids, signals_telegram_user.id
      end
      inactive_signals_telegram_users.each do |signals_telegram_user|
        assert_includes expected_ids, signals_telegram_user.id
      end
    end

    test "signals_telegram_users for notifications when `coin_key` is set" do
      signals_telegram_users = create_list(:signals_telegram_user, 3, :with_signals_telegram_subscriptions, is_active: true)
      signals_telegram_user = signals_telegram_users.sample
      coin_key = signals_telegram_user.signals_telegram_subscriptions.sample.coin.coin_key

      get "/api/signals/signals_telegram_users/for_trading_signal_notifications?coin_key=#{coin_key}", headers: auth_headers

      assert_equal 200, status
      expected_ids = response.parsed_body.map { |x| x['id'] }
      assert_equal expected_ids, [ signals_telegram_user.id ]
    end

    test "signals_telegram_subscriptions when valid" do
      signals_telegram_users = create_list(:signals_telegram_user, 3, :with_signals_telegram_subscriptions, is_active: true)
      signals_telegram_user = signals_telegram_users.first

      get "/api/signals/signals_telegram_users/#{signals_telegram_user.telegram_id}/signals_telegram_subscriptions", headers: auth_headers

      assert_equal 200, status
      assert_equal 3, response.parsed_body.count
      expected_ids = response.parsed_body.map { |x| x['id'] }
      signals_telegram_user.signals_telegram_subscriptions.find_each do |signals_telegram_subscription|
        assert_includes expected_ids, signals_telegram_subscription.id
      end
    end

    test "signals_telegram_subscriptions when searching with username" do
      signals_telegram_users = create_list(:signals_telegram_user, 3, :with_signals_telegram_subscriptions, is_active: true)
      signals_telegram_user = signals_telegram_users.first

      get "/api/signals/signals_telegram_users/#{signals_telegram_user.telegram_username}/signals_telegram_subscriptions", headers: auth_headers

      assert_equal 200, status
      assert_equal 3, response.parsed_body.count
      expected_ids = response.parsed_body.map { |x| x['id'] }
      signals_telegram_user.signals_telegram_subscriptions.find_each do |signals_telegram_subscription|
        assert_includes expected_ids, signals_telegram_subscription.id
      end
    end

    test "signals_telegram_subscriptions create when valid" do
      signals_telegram_users = create_list(:signals_telegram_user, 3, :with_signals_telegram_subscriptions, is_active: true)
      signals_telegram_user = signals_telegram_users.sample
      coins = create_list(:coin, 3)
      coin = coins.sample

      request_params = {
        signals_telegram_subscription: {
          coin_symbol: coin.symbol,
        },
      }

      assert_difference 'SignalsTelegramSubscription.count', 1 do
        post "/api/signals/signals_telegram_users/#{signals_telegram_user.telegram_id}/signals_telegram_subscriptions", params: request_params, headers: auth_headers, as: :json
      end
      assert_equal 201, status
      assert_equal coin.id, response.parsed_body['coin']['id']
      assert_includes signals_telegram_user.subscribed_coins, coin
    end

    test "signals_telegram_subscriptions destroy when valid" do
      signals_telegram_users = create_list(:signals_telegram_user, 3, :with_signals_telegram_subscriptions, is_active: true)
      signals_telegram_user = signals_telegram_users.sample
      coins = create_list(:coin, 3)
      coin = signals_telegram_user.signals_telegram_subscriptions.sample.coin

      assert_difference 'SignalsTelegramSubscription.count', -1 do
        delete "/api/signals/signals_telegram_users/#{signals_telegram_user.telegram_id}/signals_telegram_subscriptions/#{coin.symbol}", headers: auth_headers
      end
      assert_equal 204, status
      assert_not_includes signals_telegram_user.subscribed_coins, coin
    end
  end
end
