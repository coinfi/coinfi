require 'test_helper'

class NewsRoutesTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test "cannot visit index when not authenticated" do
    assert_raises(ActionController::RoutingError) do
      get "/news"
    end
  end

  test "can visit index when authenticated" do
    @user = User.create!(email: 'john.smith@example.org', password: 'abc123')
    sign_in @user

    get "/news"
    assert_equal 200, status
  end
end
