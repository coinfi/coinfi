require 'application_integration_test'
require 'test_helper'

class AuthenticationTest < ApplicationIntegrationTest
  include Devise::Test::IntegrationHelpers

  test "verified user can sign in" do
    user = create(:user)
    sign_in(user)

    get '/'

    assert_response :success
    assert_equal 200, status
  end

  test "unverified user cannot sign in" do
    user = create(:user, :unverified)
    sign_in(user)

    get '/'

    assert_response :redirect
    assert_equal 302, status
  end
end
