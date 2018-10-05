require "application_system_test_case"
require 'test_helper'

class NewsSystemTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers

  setup do
    @user = create(:user)
    @watchlist = create(:watchlist, user: @user)
    @coins = create_list(:coin, 20, :with_feed_sources, :with_news_items)
  end

  test "can visit index when authenticated" do
    LaunchDarkly::LDClient.stub_any_instance(:variation, true) do
      sign_in @user
      visit news_url
    end

    assert_selector "h1", text: "CoinFi News: Cryptocurrency News Today"
  end
end
