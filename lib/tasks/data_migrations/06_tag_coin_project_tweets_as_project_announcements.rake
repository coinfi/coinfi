namespace :data_migrations do
  desc "Add 'Project Announcements' category to coin project tweets"
  task :tag_coin_project_tweets_as_project_announcements => :environment do
    ActiveRecord::Base.transaction do
      puts "Searching for relevant NewsItem records..."
      project_announcements_category = NewsCategory.find_project_announcements!
      feed_sources = FeedSource
        .where(feed_type: 'twitter')
        .where.not(coin_id: nil)
      news_items = NewsItem
        .includes(:news_categories)
        .where(feed_source: feed_sources)

      puts "Checking and updating #{news_items.count} records..."
      update_count = 0
      news_items.find_each do |item|
        unless item.news_categories.exists?(project_announcements_category.id)
          item.news_categories << project_announcements_category
          item.last_machine_tagged_on = Time.now
          item.save!
          update_count += 1
        end
      end

      puts "Updated #{update_count} records"
    end
  end
end
