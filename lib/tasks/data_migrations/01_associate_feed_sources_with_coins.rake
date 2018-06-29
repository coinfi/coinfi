require_relative '../batch_process'

namespace :data_migrations do
  desc "Associate all twitter feed sources with their corresponding coins"
  task :associate_twitter_feed_sources_with_their_coins => :environment do
    batch_process(FeedSource.where(feed_type: 'twitter')) do |source|
      source.coin = Coin.find_by(twitter: source.site_hostname)
      source.save!
    end
  end

  desc "Associate all reddit feed sources with their corresponding coins"
  task :associate_reddit_feed_sources_with_their_coins => :environment do
    batch_process(FeedSource.where(feed_type: 'reddit')) do |source|
      source.coin = Coin.find_by(reddit: source.site_hostname)
      source.save!
    end
  end
end
