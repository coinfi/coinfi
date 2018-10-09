require "application_system_test_case"
require 'test_helper'

class NewsSystemTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers

  setup do
    @user = create(:user)
    @coins = create_list(:coin_with_news_items, 20, :with_feed_sources)
  end

  test "can visit index when authenticated" do
    login_as(@user, :scope => :user)

    LaunchDarkly::LDClient.stub_any_instance(:variation, true) do
      visit news_url
    end

    assert_selector "h1", text: "CoinFi News: Cryptocurrency News Today"
  end
end
