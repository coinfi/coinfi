require 'application_integration_test'
require 'test_helper'

class Api::SignalsTelegramBotRoutesTest < ApplicationIntegrationTest
  setup do
    @auth_headers = {
      HTTP_AUTHORIZATION: ActionController::HttpAuthentication::Basic.encode_credentials(
        ENV.fetch('SIGNALS_TELEGRAM_BOT_API_USERNAME'),
        ENV.fetch('SIGNALS_TELEGRAM_BOT_API_PASSWORD')
      )
    }
  end

  test "cannot visit register when unauthenticated" do
    post "/api/signals_telegram_bot/signals_telegram_users/register"
    assert_equal 401, status
  end

  test "cannot visit users when unauthenticated" do
    get "/api/signals_telegram_bot/signals_telegram_users"
    assert_equal 401, status
  end

  test "cannot visit signals_telegram_subscriptions when unauthenticated" do
    dummy_telegram_username = 'john_smith'
    get "/api/signals_telegram_bot/signals_telegram_users/#{dummy_telegram_username}/signals_telegram_subscriptions"
    assert_equal 401, status
  end

  test "cannot create signals_telegram_subscriptions when unauthenticated" do
    dummy_telegram_username = 'john_smith'
    post "/api/signals_telegram_bot/signals_telegram_users/#{dummy_telegram_username}/signals_telegram_subscriptions"
    assert_equal 401, status
  end

  test "cannot destroy signals_telegram_subscriptions when unauthenticated" do
    dummy_telegram_username = 'john_smith'
    dummy_coin_slug = 'dummy_coin'
    delete "/api/signals_telegram_bot/signals_telegram_users/#{dummy_telegram_username}/signals_telegram_subscriptions/#{dummy_coin_slug}"
    assert_equal 401, status
  end

  test "can visit register" do
    assert_raises(ActionController::ParameterMissing) do
      post "/api/signals_telegram_bot/signals_telegram_users/register", headers: @auth_headers
    end
  end

  test "can visit users" do
    get "/api/signals_telegram_bot/signals_telegram_users", headers: @auth_headers
    assert_equal 200, status
  end

  test "can visit signals_telegram_subscriptions" do
    dummy_telegram_username = 'john_smith'
    assert_raises(ActiveRecord::RecordNotFound) do
      get "/api/signals_telegram_bot/signals_telegram_users/#{dummy_telegram_username}/signals_telegram_subscriptions", headers: @auth_headers
    end
  end

  test "can create signals_telegram_subscriptions" do
    dummy_telegram_username = 'john_smith'
    assert_raises(ActiveRecord::RecordNotFound) do
      post "/api/signals_telegram_bot/signals_telegram_users/#{dummy_telegram_username}/signals_telegram_subscriptions", headers: @auth_headers
    end
  end

  test "can destroy signals_telegram_subscriptions" do
    dummy_telegram_username = 'john_smith'
    dummy_coin_slug = 'dummy_coin'
    assert_raises(ActiveRecord::RecordNotFound) do
      delete "/api/signals_telegram_bot/signals_telegram_users/#{dummy_telegram_username}/signals_telegram_subscriptions/#{dummy_coin_slug}", headers: @auth_headers
    end
  end
end
