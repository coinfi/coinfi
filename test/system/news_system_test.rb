require "application_system_test_case"
require 'test_helper'

class NewsSystemTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers

  setup do
    Rails.application.load_seed
    @user = create(:user)
    @coins = create_list(:coin_with_news_items, 20)
  end

  test "can visit index when authenticated" do
    login_as(@user, :scope => :user)

    LaunchDarkly::LDClient.stub_any_instance(:variation, true) do
      visit news_url
    end

    # Check title
    assert_selector "h1", text: "CoinFi News: Cryptocurrency News Today"
  end

  test "can visit coin when authenticated" do
    login_as(@user, :scope => :user)

    coin = @coins.first
    LaunchDarkly::LDClient.stub_any_instance(:variation, true) do
      visit news_coin_url(coin.slug)
    end

    # Check title
    assert_text "#{coin.name} (#{coin.symbol}) News"
    # Check chart tabs
    assert_text "News + Price Chart"
    assert_text "TradingView Chart"
    # Check related news
    assert_text "Read Related News"
  end

  test "can visit news item when authenticated" do
    login_as(@user, :scope => :user)

    news_item = @coins.first.news_items.published.first
    news_item_slug = news_item.title.parameterize
    LaunchDarkly::LDClient.stub_any_instance(:variation, true) do
      visit news_item_url(news_item.id, news_item_slug)
    end

    # Check title
    assert_selector "h1", text: news_item.title
  end
end
