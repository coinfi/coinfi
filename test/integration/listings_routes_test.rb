require 'application_integration_test'
require 'test_helper'

class ListingRoutesTest < ApplicationIntegrationTest
  include Devise::Test::IntegrationHelpers

  test "cannot visit index when not authenticated" do
    assert_raises(ActionController::RoutingError) do
      get "/listings"
    end
  end

  test "can visit index when authenticated" do
    @user = User.create!(email: 'john.smith@example.org', password: 'abc123')
    sign_in @user

    get "/listings"
    assert_equal 200, status
  end
end
