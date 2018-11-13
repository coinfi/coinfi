require 'application_integration_test'
require 'test_helper'

class NewsRoutesTest < ApplicationIntegrationTest
  include Devise::Test::IntegrationHelpers

  test "cannot visit index when not authenticated" do
    get "/news"
    assert_response :redirect
    follow_redirect!
    assert_response :success
    assert_select "h2", "Login"
  end

  test "cannot visit index when authenticated but not authorized" do
    user = create(:user)
    login_as(user, :scope => :user)

    LaunchDarkly::LDClient.stub_any_instance(:variation, false) do
      assert_raises(ActionController::RoutingError) do
        get "/news"
      end
    end
  end

  test "can visit index when authenticated" do
    user = create(:user)
    login_as(user, :scope => :user)

    LaunchDarkly::LDClient.stub_any_instance(:variation, true) do
      get "/news"
    end

    assert_equal 200, status
  end
end
