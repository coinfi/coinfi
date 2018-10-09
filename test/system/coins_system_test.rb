require "application_system_test_case"
require 'test_helper'

class CoinsSystemTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers

  setup do
    Rails.application.load_seed
    @user = create(:user)
    @coins = create_list(:coin, 20)
  end

  test "can visit index when authenticated" do
    login_as(@user, :scope => :user)

    LaunchDarkly::LDClient.stub_any_instance(:variation, true) do
      visit coins_url
    end

    # Check title
    assert_selector "h1", text: "Coins"
  end

  test "can visit coin when authenticated" do
    login_as(@user, :scope => :user)

    coin = @coins.first
    LaunchDarkly::LDClient.stub_any_instance(:variation, true) do
      visit coin_url(coin.slug)
    end

    # Check title
    assert_selector "span", text: coin.name
    assert_selector "span", text: coin.symbol
    assert_selector "span", text: coin.price['usd'].round(6)
    # Check chart tabs
    assert_text "News + Price Chart"
    assert_text "TradingView Chart"
    # Check related news
    assert_text "Related Coins"
  end
end
