require "application_system_test_case"
require 'test_helper'

class CoinsSystemTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers

  setup do
    Rails.application.load_seed
    @user = create(:user)
    @coins = create_list(:coin, 20)
  end

  teardown do
    Warden.test_reset!
  end

  test "can visit index when authenticated" do
    login_as(@user, :scope => :user)

    visit coins_url

    # Check title
    assert_selector "h1", text: "Coins"
  end

  test "can visit coin when authenticated" do
    login_as(@user, :scope => :user)

    coin = @coins.first

    visit coin_url(coin.slug)

    # Check title
    assert_selector "span", text: coin.name
    assert_selector "span", text: coin.symbol
    assert_selector "span", text: coin.price.round(6)
    # Check chart tabs
    assert_text "News + Price Chart"
    assert_text "TradingView Chart"
    # Check related news
    assert_text "Related Coins"
  end

  test "can see trading view" do
    coin = @coins.first
    visit coin_url(coin.slug)

    # Go to trading view
    click_button('TradingView Chart')
    # save_screenshot("tmp/screenshots/screenshot-trading-view-#{Time.now.to_i}.png")

    # Check for trading view iframe
    iframe_selector = 'div#tradingview iframe'
    iframe_element_selector = 'div.chart-container.active'
    has_iframe = has_selector?(iframe_selector)

    # Check for element within iframe
    has_iframe_element = nil
    within_frame(find(iframe_selector)) do
      has_iframe_element = has_selector?(iframe_element_selector)
    end

    # Test above checks
    assert_equal has_iframe, true
    assert_equal has_iframe_element, true
  end
end
