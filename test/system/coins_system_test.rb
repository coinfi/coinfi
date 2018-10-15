require "application_system_test_case"
require 'test_helper'

class CoinsSystemTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers

  setup do
    Rails.application.load_seed
    @user = create(:user)
    @coins = create_list(:coin, 20)
    @coin = Coin.find_by(name: 'Bitcoin')
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

  test "can see trading view" do
    Capybara.visit "/coins/#{@coin.slug}"

    Capybara.page.click_button('TradingView Chart')
    Capybara.page.save_screenshot("screenshot-#{Time.now.to_i}.png")

    iframe_selector = 'div#tradingview iframe'
    iframe_element_selector = 'div.chart-container.active'

    has_iframe = Capybara.page.has_selector?(iframe_selector)
    has_iframe_element = nil
    Capybara.page.within_frame(Capybara.page.find(iframe_selector)) do
      has_iframe_element = Capybara.page.has_selector?(iframe_element_selector)
    end

    assert_equal has_iframe, true
    assert_equal has_iframe_element, true
  end
end
