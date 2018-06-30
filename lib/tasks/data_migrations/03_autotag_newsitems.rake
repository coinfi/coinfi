require_relative '../batch_process'

namespace :data_migrations do
  desc 'Automatically tags NewsItems from Twitter and Reddit with the corresponding Coin'
  task :autotag_newsitems => :environment do
    batch_process(FeedSource.where.not(coin_id: nil)) do |source|
      unless source.coin.news_items.include?(source.news_items)
        # This job is made idempotent via:
        # https://stackoverflow.com/questions/1315109/rails-idiom-to-avoid-duplicates-in-has-many-through
        source.coin.news_items |= source.news_items
      end
    end
  end
end
