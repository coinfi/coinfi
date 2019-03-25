require "application_system_test_case"
require 'test_helper'

class NewsSystemTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers

  setup do
    Rails.application.load_seed
    @user = create(:user)
    @coins = create_list(:coin_with_news_items, 20)
  end

  teardown do
    Warden.test_reset!
  end

  test "can visit index when authenticated" do
    login_as(@user, :scope => :user)

    visit news_url

    # Check title
    assert_selector "h1", text: "CoinFi News: Cryptocurrency News Today"
  end

  test "can visit coin when authenticated" do
    login_as(@user, :scope => :user)

    coin = @coins.first

    visit news_coin_url(coin.slug)

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
    news_item_slug = news_item.slug

    visit news_item_url(news_item.id, news_item_slug)

    # Check title
    assert_selector "h1", text: news_item.title
  end

  test "news items with reddit filter" do
    # Login
    login_as(@user, :scope => :user)

    visit news_url

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

  test "news items with twitter filter" do
    # Login
    login_as(@user, :scope => :user)

    visit news_url

    # Open and set filter
    click_button('Filter')
    twitter_button = find(:xpath, "//span[contains(text(),'Twitter')]/following-sibling::button")
    twitter_button.click
    assert twitter_button[:class].include?("on"), true
    click_button('Apply')

    # Check against expected news items
    feed_sources = FeedSource.active.where.not(id: FeedSource.reddit)
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

  test "news items with general filter" do
    # Login
    login_as(@user, :scope => :user)

    visit news_url

    # Get a general filter
    random_feed = nil
    random_coin = nil
    while !random_feed do
      random_coin = @coins.sample
      random_coin.feed_sources.each do |feed_source|
        if (feed_source.feed_type == 'general')
          random_feed = feed_source
        end
      end
    end

    # Open and set filter
    click_button('Filter')
    check(random_feed.site_hostname)
    click_button('Apply')

    # Check against expected news items
    feed_sources = FeedSource.active
      .where.not(id: FeedSource.reddit)
      .where.not(id: FeedSource.twitter)
      .where(site_hostname: [random_feed.site_hostname])
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

  test "news items with general and reddit filter" do
    # Login
    login_as(@user, :scope => :user)

    visit news_url

    # Get a general filter
    random_feed = nil
    random_coin = nil
    while !random_feed do
      random_coin = @coins.sample
      random_coin.feed_sources.each do |feed_source|
        if (feed_source.feed_type == 'general')
          random_feed = feed_source
        end
      end
    end

    # Open and set filter
    click_button('Filter')

    reddit_button = find(:xpath, "//span[contains(text(),'Reddit')]/following-sibling::button")
    reddit_button.click
    assert reddit_button[:class].include?("on"), true

    check(random_feed.site_hostname)

    click_button('Apply')

    # Check against expected news items
    feed_sources = FeedSource.active
      .where.not(id: FeedSource.twitter)
      .where(site_hostname: [random_feed.site_hostname])
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

  test "news items with reddit and twitter filters" do
    # Login
    login_as(@user, :scope => :user)

    visit news_url

    # Open and set filter
    click_button('Filter')

    twitter_button = find(:xpath, "//span[contains(text(),'Twitter')]/following-sibling::button")
    twitter_button.click
    assert twitter_button[:class].include?("on"), true

    reddit_button = find(:xpath, "//span[contains(text(),'Reddit')]/following-sibling::button")
    reddit_button.click
    assert reddit_button[:class].include?("on"), true

    click_button('Apply')

    # Check against expected news items
    feed_sources = FeedSource.active
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

  test "news items with start date filter" do
    # Login
    login_as(@user, :scope => :user)

    visit news_url

    date_format = "%m/%d/%Y"
    start_date = (Date.current - Random.rand(10)).to_datetime

    # Open and set filter
    click_button('Filter')

    start_input = find("input[placeholder='Start Date']")
    start_input.set start_date.strftime(date_format)

    assert start_input.value, start_date.strftime(date_format)

    click_button('Apply')

    # Check against expected news items
    expected_news_items = NewsItems::WithFilters.call(
      NewsItem.published,
      published_since: start_date
    ).order_by_published.limit(25)

    within '#newsfeed' do
      expected_news_items.each do |news_item|
        assert_text(:all, news_item.title)
      end
    end
  end

  test "news items with end date filter" do
    # Login
    login_as(@user, :scope => :user)

    visit news_url

    date_format = "%m/%d/%Y"
    end_date = (Date.current - Random.rand(10)).to_datetime

    # Open and set filter
    click_button('Filter')

    end_input = find("input[placeholder='Start Date']")
    end_input.set end_date.strftime(date_format)

    assert end_input.value, end_date.strftime(date_format)

    click_button('Apply')

    # Check against expected news items
    expected_news_items = NewsItems::WithFilters.call(
      NewsItem.published,
      published_since: end_date
    ).order_by_published.limit(25)

    within '#newsfeed' do
      expected_news_items.each do |news_item|
        assert_text(:all, news_item.title)
      end
    end
  end

  test "news items with date filter" do
    # Login
    login_as(@user, :scope => :user)

    visit news_url

    date_format = "%m/%d/%Y"
    end_date = (Date.current - Random.rand(4)).to_datetime
    start_date = (end_date - Random.rand(4)).to_datetime

    # Open and set filter
    click_button('Filter')

    end_input = find("input[placeholder='End Date']")
    end_input.set end_date.strftime(date_format)

    # Click elsewhere to avoid fill error on second input
    find('h4', text: 'Date Range').click

    start_input = find("input[placeholder='Start Date']")
    start_input.set start_date.strftime(date_format)

    assert start_input.value, start_date.strftime(date_format)
    assert end_input.value, end_date.strftime(date_format)

    click_button('Apply')

    # Check against expected news items
    expected_news_items = NewsItems::WithFilters.call(
      NewsItem.published,
      published_since: start_date,
      published_until: end_date
    ).order_by_published.limit(25)

    within '#newsfeed' do
      expected_news_items.each do |news_item|
        assert_text(:all, news_item.title)
      end
    end
  end

  test "news items with category filter" do
    # Login
    login_as(@user, :scope => :user)

    visit news_url

    # Get a category filter
    random_category = NewsCategory.all.sample

    # Open and set filter
    click_button('Filter')

    category_btn = all('.category-btn').select {|elt| elt.text == random_category.name }.first.find('button')
    category_btn.click
    assert category_btn[:class].include?("selected"), true

    click_button('Apply')

    # Check against expected news items
    news_categories = NewsCategory.where(name: [random_category.name])
    expected_news_items = NewsItems::WithFilters.call(
        NewsItem.published,
        news_categories: news_categories
      ).order_by_published.limit(25)

    within '#newsfeed' do
      expected_news_items.each do |news_item|
        assert_text(:all, news_item.title)
      end
    end
  end
end
