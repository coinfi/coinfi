require 'application_integration_test'
require 'test_helper'

class Api::Signals::BaseTest < ApplicationIntegrationTest
  def auth_headers
    @auth_headers ||= {
      HTTP_AUTHORIZATION: ActionController::HttpAuthentication::Basic.encode_credentials(
        ENV.fetch('SIGNALS_API_USERNAME'),
        ENV.fetch('SIGNALS_API_PASSWORD')
      )
    }
  end
end
