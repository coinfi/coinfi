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

  test "news items with reddit filter" do
    # Login
    login_as(@user, :scope => :user)
    LaunchDarkly::LDClient.stub_any_instance(:variation, true) do
      visit news_url
    end

    # Open and set filter
    click_button('Filter')
    reddit_button = find(:xpath, "//span[contains(text(),'Reddit')]/following-sibling::button")
    reddit_button.click
    assert reddit_button[:class].include?("on"), true
    click_button('Apply')
    
    # Check against expected news items
    feed_sources = FeedSource.active.where.not(id: FeedSource.twitter)
    expected_news_items = NewsItems::WithFilters.call(
        NewsItem.published, 
        feed_sources: feed_sources
      ).order_by_published.limit(25)
    
    within '#newsfeed' do
      expected_news_items.each do |news_item|
        assert_text(:all, news_item.title)
      end
    end
  end
end
