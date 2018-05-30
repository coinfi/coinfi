require_relative '../batch_process'

namespace :data_migrations do
  task :tag_news_items_that_came_from_twitter_and_reddit_feeds_with_their_corresponding_coins => :environment do
    batch_process(FeedSource.where.not(coin_id: nil)) do |source|
      source.coin.news_items << source.news_items
    end
  end
end
