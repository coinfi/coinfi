module NewsServices
  class TweetTrendingNewsItem < Patterns::Service
    include Rails.application.routes.url_helpers
    LOG_PREFIX = '[NewsTweet]'
    MAX_ACCEPTABLE_REPLICATION_LAG = ::ApplicationHelper::MAX_ACCEPTABLE_REPLICATION_LAG

    # Test run will not send to Twitter or save to database, but will still notify on slack
    def initialize(min_tweet_interval: 4.hours, max_tweets_per_day: 4, min_votes_required: 10, leading_text: "", max_coin_tag_count: 3, test_run: false)
      @min_tweet_interval = min_tweet_interval
      @max_tweets_per_day = max_tweets_per_day
      @min_votes_required = min_votes_required
      @leading_text = leading_text
      @max_coin_tag_count = max_coin_tag_count
      @test_run = test_run
      @slack_channel = '#' + ENV.fetch('SLACK_CHANNEL_TRENDING_NEWS').gsub('#', '')

      @news_votes = nil
      @news_item = nil
    end

    def call
      unless can_tweet?
        puts "#{LOG_PREFIX} Cannot tweet."
        return
      end

      fetch_trendingest_news_item
      unless should_tweet?
        puts "#{LOG_PREFIX} Should not tweet ##{@news_item.try(:id)}: #{@news_item.try(:title)}."
        return
      end

      tweet_obj = send_news_item_tweet
      if !@test_run
        if tweet_obj.present?
          store_news_item_tweet(tweet_obj)
        else
          error_message = "Failed to send tweet ##{@news_item.try(:id)}: #{@news_item.try(:title)}."
          puts "#{LOG_PREFIX} #{error_message}"
          slack_client.chat_postMessage(channel: @slack_channel, text: error_message, as_user: true)
        end
      else
        puts "#{LOG_PREFIX} Test run; not storing tweet."
      end

      tweet_obj
    end

    private

    # Up to 280 characters; links count as 23 characters
    # Include up to `max_coin_tag_count` coin tags
    def build_tweet
      link = build_url news_item_path(id: @news_item.id, slug: @news_item.slug)
      coin_tags_sorted_by_rank = @news_item.coins.pluck(:ranking, :symbol)
        .sort_by { |coin| coin[0] || Float::INFINITY }
        .map { |coin| coin[1] }
        .uniq
      coin_tag_text = coin_tags_sorted_by_rank.slice(0, @max_coin_tag_count)
        .map { |coin_tag| '$' + coin_tag }
        .join(' ')

      # constant ints: max length, url length, spaces
      max_title_length = 280 - 23 - 2 - @leading_text.length - coin_tag_text.length
      news_title = shorten_text(@news_item.title, max_title_length)

      "#{@leading_text}#{news_title} #{link} #{coin_tag_text}"
    end

    def build_url(relative_path)
      protocol = Rails.env.development? ? 'http://' : 'https://'

      "#{protocol}#{ENV.fetch('ROOT_DOMAIN')}#{relative_path}"
    end

    def can_tweet?
      distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
        recent_tweets = NewsTweet.where("updated_at >= now() - interval '1 day'").order("updated_at DESC")

        # shortcut checking if no recent tweets
        if recent_tweets.empty?
          return true
        end

        if recent_tweets.length >= @max_tweets_per_day
          return false
        end

        if recent_tweets.first.updated_at >= DateTime.now() - @min_tweet_interval
          return false
        end
      end

      true
    end

    def fetch_trendingest_news_item
      distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
        @news_votes = NewsVotesTrending.order_by_score.joins(:news_item).first
        @news_item = @news_votes.news_item if @news_votes.present?
      end
    end

    def store_news_item_tweet(tweet_obj)
      metadata = {
        score: @news_votes.score,
        total: @news_votes.total,
        tweet_id: tweet_obj.id,
      }
      NewsTweet.create!(news_item_id: @news_item.id,
        tweet_body: tweet_obj.text,
        metadata: metadata)
    end

    def send_news_item_tweet
      tweet_body = build_tweet

      slack_client.chat_postMessage(channel: @slack_channel, text: tweet_body, as_user: true)

      if !@test_run
        twitter_client.update(tweet_body)
      end
    end

    def shorten_text(text, max_length)
      if text.length > max_length
        text.slice(0, max_length - 1) + '…'
      else
        text
      end
    end

    def should_tweet?
      if NewsTweet.exists?(news_item_id: @news_item.id)
        return false
      end

      if @news_votes.score < @min_votes_required
        return false
      end

      true
    end

    def twitter_client
      @twitter_client ||= Twitter::REST::Client.new do |config|
        config.consumer_key        = ENV.fetch('TWITTER_CONSUMER_KEY')
        config.consumer_secret     = ENV.fetch('TWITTER_CONSUMER_SECRET')
        config.access_token        = ENV.fetch('TWITTER_ACCESS_TOKEN')
        config.access_token_secret = ENV.fetch('TWITTER_ACCESS_SECRET')
      end
    end

    def slack_client
      @slack_client ||= Slack::Web::Client.new
    end
  end
end