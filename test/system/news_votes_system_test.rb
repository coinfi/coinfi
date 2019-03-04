require "application_system_test_case"
require 'test_helper'

class NewsVotesSystemTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers
  include NewsHelper

  setup do
    Rails.application.load_seed
    @users = create_list(:user, 20)
    @news = create_list(:news_item, 20, is_published: true)
    @votes = @users.flat_map do |user|
      @news.map do |item|
        create(:news_vote, user_id: user.id, news_item_id: item.id)
      end
    end

    @current_user = @users.first

    Rails.cache.clear("default_news_items")
  end

  test "unauthorized user can't vote" do
    news_item = NewsItem.published.first
    news_item_slug = news_item.title.parameterize
    votes = NewsVote.votes_for_news_item(news_item_id: news_item.id)

    visit news_item_url(news_item, news_item_slug)

    within '.selected-news-content' do
      assert_no_selector('.with-controls')
      # no good id/class to identify vote div by
      vote_div = find('span > div', text: votes[:total])
      assert vote_div.has_no_selector?(:xpath, '..//button')
    end
  end

  test "authorized user has vote buttons" do
    # Login
    login_as(@current_user, :scope => :user)

    news_item = NewsItem.published.first
    news_item_slug = news_item.title.parameterize
    votes = NewsVote.votes_for_news_item(news_item_id: news_item.id)

    visit news_item_url(news_item, news_item_slug)

    within '.selected-news-content' do
      assert_selector('.with-controls')
      # no good id/class to identify vote div by
      vote_div = find('span > div', text: votes[:total])
      assert vote_div.has_selector?(:xpath, '..//button', minimum: 2)
    end
  end

  test "authorized user can upvote" do
    # Login
    login_as(@current_user, :scope => :user)

    news_item = NewsItem.published.first
    news_item_slug = news_item.title.parameterize
    votes = NewsVote.votes_for_news_item(news_item_id: news_item.id)

    visit news_item_url(news_item, news_item_slug)

    # check value before clicking
    news_title = find('#newsfeed h4', text: news_item.title)
    news_details = news_title.find(:xpath, './/following-sibling::div')
    assert news_details.has_text?(:all, votes[:total])

    vote_div = find('.selected-news-content div.with-controls', text: votes[:total])
    upvote_button = vote_div.first('button')
    upvote_button.click

    #check value after clicking
    assert news_details.has_no_text?(:all, votes[:total])
    assert vote_div.has_no_text?(:all, votes[:total])
  end

  test "authorized user can downvote" do
    # Login
    login_as(@current_user, :scope => :user)

    news_item = NewsItem.published.first
    news_item_slug = news_item.title.parameterize
    votes = NewsVote.votes_for_news_item(news_item_id: news_item.id)

    visit news_item_url(news_item, news_item_slug)

    # check value before clicking
    news_title = find('#newsfeed h4', text: news_item.title)
    news_details = news_title.find(:xpath, './/following-sibling::div')
    assert news_details.has_text?(:all, votes[:total])

    vote_div = find('.selected-news-content div.with-controls', text: votes[:total])
    upvote_button = vote_div.find('button:last-of-type')
    upvote_button.click

    #check value after clicking
    assert news_details.has_no_text?(:all, votes[:total])
    assert vote_div.has_no_text?(:all, votes[:total])
  end

  test "news items with votes" do
    # Login
    login_as(@current_user, :scope => :user)

    visit news_url

    # Check against expected news items
    expected_news_items = default_news_query

    within '#newsfeed' do
      expected_news_items.each do |news_item|
        votes = NewsVote.votes_for_news_item(news_item_id: news_item.id)
        news_title = find('h4', text: news_item.title)
        news_details = news_title.find(:xpath, './/following-sibling::div')
        assert news_details.has_text?(:all, votes[:total])
      end
    end
  end
end
