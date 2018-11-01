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

  test "can visit register" do
    assert_raises(ActionController::ParameterMissing) do
      post "/api/signals_telegram_bot/signals_telegram_users/register", headers: @auth_headers
    end
  end

  test "cannot visit subscribers when unauthenticated" do
    get "/api/signals_telegram_bot/signals_telegram_users"
    assert_equal 401, status
  end

  test "can visit subscribers" do
    get "/api/signals_telegram_bot/signals_telegram_users", headers: @auth_headers
    assert_equal 200, status
  end
end
