require "application_system_test_case"
require 'test_helper'
require 'faker'

class NewsVotesSystemTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers

  setup do
    Rails.application.load_seed
    @users = create_list(:user, 20)
    @news = create_list(:news_item, 20, is_published: true)
    @votes = @users.flat_map do |user|
      @news.map do |item|
        item.vote_by(voter: user, vote: Faker::Boolean.boolean)
      end
    end

    @current_user = @users.first

    Rails.cache.clear("default_news_item_ids")
  end

  teardown do
    Rails.cache.clear("default_news_item_ids")
    Warden.test_reset!
  end

  test "unauthorized user can't vote" do
    news_item = NewsItem.published.first
    news_item_slug = news_item.slug
    vote_score = news_item.weighted_score

    visit news_item_url(news_item, news_item_slug)

    within '.selected-news-content' do
      assert_no_selector('.with-controls')
      # no good id/class to identify vote div by
      vote_div = find('span > div', text: vote_score)
      assert vote_div.has_no_selector?(:xpath, '..//button')
    end
  end

  test "authorized user has vote buttons" do
    # Login
    login_as(@current_user, :scope => :user)

    news_item = NewsItem.published.first
    news_item_slug = news_item.slug
    vote_score = news_item.weighted_score

    visit news_item_url(news_item, news_item_slug)

    within '.selected-news-content' do
      assert_selector('.with-controls')
      # no good id/class to identify vote div by
      vote_div = find('span > div', text: vote_score)
      assert vote_div.has_selector?(:xpath, '..//button', minimum: 2)
    end
  end

  test "authorized user can upvote" do
    # Login
    login_as(@current_user, :scope => :user)

    news_item = NewsItem.published.first
    news_item_slug = news_item.slug

    visit news_item_url(news_item, news_item_slug)

    # check value before clicking
    news_title = find('#newsfeed h4', text: news_item.title)
    news_details = news_title.find(:xpath, './/following-sibling::div')
    original_score = news_item.weighted_score
    assert news_details.has_text?(:all, original_score)

    vote_div = find('.selected-news-content div.with-controls', text: original_score)
    upvote_button = vote_div.first('button')
    upvote_button.click

    #check value after clicking
    news_item = NewsItem.find_by_id(news_item.id)
    new_score = news_item.weighted_score
    assert news_details.has_text?(:all, new_score)
    assert vote_div.has_text?(:all, new_score)
    assert news_details.has_no_text?(:all, original_score)
    assert vote_div.has_no_text?(:all, original_score)
  end

  test "authorized user can downvote" do
    # Login
    login_as(@current_user, :scope => :user)

    news_item = NewsItem.published.first
    news_item_slug = news_item.slug

    visit news_item_url(news_item, news_item_slug)

    # check value before clicking
    news_title = find('#newsfeed h4', text: news_item.title)
    news_details = news_title.find(:xpath, './/following-sibling::div')
    original_score = news_item.weighted_score
    assert news_details.has_text?(:all, original_score)

    vote_div = find('.selected-news-content div.with-controls', text: original_score)
    downvote_button = vote_div.find('button:last-of-type')
    downvote_button.click

    #check value after clicking
    news_item = NewsItem.find_by_id(news_item.id)
    new_score = news_item.weighted_score
    assert news_details.has_text?(:all, new_score)
    assert vote_div.has_text?(:all, new_score)
    assert news_details.has_no_text?(:all, original_score)
    assert vote_div.has_no_text?(:all, original_score)
  end

  test "news items with votes" do
    # Login
    login_as(@current_user, :scope => :user)

    visit news_url

    # Check against expected news items
    expected_news_items = NewsServices::RetrieveDefaultNewsItems.call.try(:result)

    within '#newsfeed' do
      expected_news_items.each do |news_item|
        news_title = find('h4', text: news_item.title)
        news_details = news_title.find(:xpath, './/following-sibling::div')
        assert news_details.has_text?(:all, news_item.weighted_score)
      end
    end
  end
end