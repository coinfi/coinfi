require 'sidekiq-scheduler'
class TweetTrendingNews
  include Sidekiq::Worker

  def perform
    NewsServices::TweetTrendingNewsItem.call(test_run: true, store_test_run: true)
  end
end