require_relative '../batch_process'

namespace :data_migrations do
  desc 'Automatically tags NewsItems from Twitter and Reddit with the corresponding Coin'
  task :autotag_newsitems => :environment do
    batch_process(FeedSource.where.not(coin_id: nil)) do |source|
      source.coin.news_items << source.news_items
    end
  end
end
