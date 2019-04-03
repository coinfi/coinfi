require 'test_helper'

class TweetTrendingNewsItemTest < ActiveSupport::TestCase
  setup do
    Rails.application.load_seed
    @users = create_list(:user, 20)
    @news = create_list(:news_item, 20, is_published: true)

    @twitter_mock = Minitest::Mock.new
    def @twitter_mock.update(tweet_body); Twitter::Tweet.new(id: Faker::Twitter.status[:id], text: tweet_body); end

    @slack_mock = Minitest::Mock.new
    def @slack_mock.chat_postMessage(hash); {}; end

    Rails.cache.clear("default_news_item_ids")
    initialize_views
  end

  teardown do
    Rails.cache.clear("default_news_item_ids")
    teardown_views
  end

  test 'tweets trending news item' do
    @news_item = @news.first
    @votes = @users.flat_map do |user|
      @news_item.vote_by(voter: user, vote: true)
    end

    # Make sure trending votes view is current
    NewsServices::RefreshNewsVotesTrendingView.call

    Twitter::REST::Client.stub :new, ->(*_args) { @twitter_mock } do
      # Slack::Web::Client.stub :new, @slack_mock do
        tweet_news_service = NewsServices::TweetTrendingNewsItem.call
        response_hash = tweet_news_service.result

        # Tweet sent
        assert response_hash.present? && response_hash['twitter'].present?
        # Tweet stored
        assert NewsTweet.exists?(news_item_id: @news_item.id)
      # end
    end
  end

  test 'cannot tweet if recently tweeted' do
    @recent_news_item = @news[1]
    @recent_tweet = NewsTweet.create!(news_item_id: @recent_news_item.id, tweet_body: @recent_news_item.title)

    @news_item = @news[0]
    @votes = @users.flat_map do |user|
      @news_item.vote_by(voter: user, vote: true)
    end

    # Make sure trending votes view is current
    NewsServices::RefreshNewsVotesTrendingView.call

    Twitter::REST::Client.stub :new, ->(*_args) { @twitter_mock } do
      # Slack::Web::Client.stub :new, @slack_mock do
        tweet_news_service = NewsServices::TweetTrendingNewsItem.call
        response_hash = tweet_news_service.result

        # Tweet not sent
        assert response_hash.blank?
        # Tweet not stored
        refute NewsTweet.exists?(news_item_id: @news_item.id)
      # end
    end
  end

  test 'cannot tweet if too many tweets even if no recent tweet' do
    @not_so_recent_timestamp = DateTime.now() - 23.hours
    @not_so_recent_news_items = @news.slice(1, 5)
    @not_so_recent_tweets = @not_so_recent_news_items.map do |news_item|
      NewsTweet.create!(
        news_item_id: news_item.id,
        tweet_body: news_item.title,
        created_at: @not_so_recent_timestamp,
        updated_at: @not_so_recent_timestamp)
    end

    @news_item = @news[0]
    @votes = @users.flat_map do |user|
      @news_item.vote_by(voter: user, vote: true)
    end

    # Make sure trending votes view is current
    NewsServices::RefreshNewsVotesTrendingView.call

    Twitter::REST::Client.stub :new, ->(*_args) { @twitter_mock } do
      # Slack::Web::Client.stub :new, @slack_mock do
        tweet_news_service = NewsServices::TweetTrendingNewsItem.call
        response_hash = tweet_news_service.result

        # Tweet not sent
        assert response_hash.blank?
        # Tweet not stored
        refute NewsTweet.exists?(news_item_id: @news_item.id)
      # end
    end
  end

  test 'should not tweet if already tweeted' do
    @old_timestamp = DateTime.now() - 1.year
    @news_item = @news.first
    @previous_tweet = NewsTweet.create!(
      news_item_id: @news_item.id,
      tweet_body: @news_item.title,
      created_at: @old_timestamp,
      updated_at: @old_timestamp)
    @votes = @users.flat_map do |user|
      @news_item.vote_by(voter: user, vote: true)
    end

    # Make sure trending votes view is current
    NewsServices::RefreshNewsVotesTrendingView.call

    Twitter::REST::Client.stub :new, ->(*_args) { @twitter_mock } do
      # Slack::Web::Client.stub :new, @slack_mock do
        tweet_news_service = NewsServices::TweetTrendingNewsItem.call
        response_hash = tweet_news_service.result

        # Tweet not sent
        assert response_hash.blank?
        # Tweet already stored
        assert NewsTweet.exists?(news_item_id: @news_item.id)
      # end
    end
  end

  test 'should not tweet if votes are negative' do
    @news_item = @news.first
    @votes = @users.flat_map do |user|
      @news_item.vote_by(voter: user, vote: false)
    end

    # Make sure trending votes view is current
    NewsServices::RefreshNewsVotesTrendingView.call

    Twitter::REST::Client.stub :new, ->(*_args) { @twitter_mock } do
      # Slack::Web::Client.stub :new, @slack_mock do
        tweet_news_service = NewsServices::TweetTrendingNewsItem.call
        response_hash = tweet_news_service.result

        # Tweet not sent
        assert response_hash.blank?
        # Tweet not stored
        refute NewsTweet.exists?(news_item_id: @news_item.id)
      # end
    end
  end

  protected

  def initialize_views
    @connection ||= ActiveRecord::Base.connection
    @connection.execute <<-SQL
      CREATE MATERIALIZED VIEW news_votes_trending_view AS SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN vote_flag THEN vote_weight ELSE vote_weight * -1 END) AS score,
        votable_id AS id
      FROM votes
      WHERE votable_type = 'NewsItem'
      AND updated_at >= now() - interval '1 day'
      GROUP BY votable_id
      WITH DATA;
    SQL

    @connection.execute <<-SQL
    CREATE UNIQUE INDEX index_news_votes_trending_view ON news_votes_trending_view(id);
    SQL
  end

  def teardown_views
    @connection ||= ActiveRecord::Base.connection
    @connection.execute <<-SQL
    DROP MATERIALIZED VIEW news_votes_trending_view;
    SQL
  end

end
