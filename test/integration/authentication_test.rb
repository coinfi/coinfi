require 'application_integration_test'
require 'test_helper'

class AuthenticationTest < ApplicationIntegrationTest
  teardown do
    Warden.test_reset!
  end

  test "verified user can sign in" do
    user = create(:user)
    login_as(user, :scope => :user)
    assert_nothing_raised { get '/' }
  end

  test "unverified user cannot sign in" do
    user = create(:user, :unverified)
    login_as(user, :scope => :user)
    assert_throws :warden { get '/' }
  end
end
