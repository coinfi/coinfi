require 'application_integration_test'
require 'test_helper'

class Api::SignalsTelegramBot::BaseTest < ApplicationIntegrationTest
  def auth_headers
    @auth_headers ||= {
      HTTP_AUTHORIZATION: ActionController::HttpAuthentication::Basic.encode_credentials(
        ENV.fetch('SIGNALS_TELEGRAM_BOT_API_USERNAME'),
        ENV.fetch('SIGNALS_TELEGRAM_BOT_API_PASSWORD')
      )
    }
  end
end
