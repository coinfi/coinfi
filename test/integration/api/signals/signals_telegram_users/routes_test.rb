require 'application_integration_test'
require 'test_helper'
require_relative '../base_test'

module Api::Signals::SignalsTelegramUsers
  class RoutesTest < Api::Signals::BaseTest
    test "cannot visit register when unauthenticated" do
      post "/api/signals/signals_telegram_users/register"
      assert_equal 401, status
    end

    test "cannot visit users when unauthenticated" do
      get "/api/signals/signals_telegram_users"
      assert_equal 401, status
    end

    test "cannot visit signals_telegram_subscriptions when unauthenticated" do
      dummy_telegram_username = 'dummy_user'
      get "/api/signals/signals_telegram_users/#{dummy_telegram_username}/signals_telegram_subscriptions"
      assert_equal 401, status
    end

    test "cannot create signals_telegram_subscriptions when unauthenticated" do
      dummy_telegram_username = 'dummy_user'
      post "/api/signals/signals_telegram_users/#{dummy_telegram_username}/signals_telegram_subscriptions"
      assert_equal 401, status
    end

    test "cannot destroy signals_telegram_subscriptions when unauthenticated" do
      dummy_telegram_username = 'dummy_user'
      dummy_coin_symbol = 'aaa'
      delete "/api/signals/signals_telegram_users/#{dummy_telegram_username}/signals_telegram_subscriptions/#{dummy_coin_symbol}"
      assert_equal 401, status
    end

    test "can visit register" do
      assert_raises(ActionController::ParameterMissing) do
        post "/api/signals/signals_telegram_users/register", headers: auth_headers
      end
    end

    test "can visit users" do
      get "/api/signals/signals_telegram_users", headers: auth_headers
      assert_equal 200, status
    end

    test "can visit signals_telegram_subscriptions" do
      dummy_telegram_username = 'dummy_user'
      assert_raises(ActiveRecord::RecordNotFound) do
        get "/api/signals/signals_telegram_users/#{dummy_telegram_username}/signals_telegram_subscriptions", headers: auth_headers
      end
    end

    test "can create signals_telegram_subscriptions" do
      dummy_telegram_username = 'dummy_user'
      assert_raises(ActiveRecord::RecordNotFound) do
        post "/api/signals/signals_telegram_users/#{dummy_telegram_username}/signals_telegram_subscriptions", headers: auth_headers
      end
    end

    test "can destroy signals_telegram_subscriptions" do
      dummy_telegram_username = 'dummy_user'
      dummy_coin_symbol = 'aaa'
      assert_raises(ActiveRecord::RecordNotFound) do
        delete "/api/signals/signals_telegram_users/#{dummy_telegram_username}/signals_telegram_subscriptions/#{dummy_coin_symbol}", headers: auth_headers
      end
    end
  end
end
