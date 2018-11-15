require 'application_integration_test'
require 'test_helper'

class NewsRoutesTest < ApplicationIntegrationTest
  include Devise::Test::IntegrationHelpers

  test "can visit index when not authenticated" do
    get "/news"

    assert_equal 200, status
  end

  test "can visit index when authenticated" do
    user = create(:user)
    login_as(user, :scope => :user)

    get "/news"

    assert_equal 200, status
  end
end
