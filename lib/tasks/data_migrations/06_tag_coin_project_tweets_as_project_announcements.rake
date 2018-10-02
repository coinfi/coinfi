namespace :data_migrations do
  desc "Add 'Project Announcements' category to coin project tweets"
  task :tag_coin_project_tweets_as_project_announcements => :environment do
    project_announcements_category = NewsCategory.find_project_announcements!
    feed_sources = FeedSource
      .where(feed_type: 'twitter')
      .where.not(coin_id: nil)
    news_items = NewsItem
      .includes(:news_categories)
      .where(feed_source: feed_sources)

    batch_process(news_items) do |item|
      unless item.news_categories.include?(project_announcements_category)
        item.news_categories << project_announcements_category
        item.save!
      end
    end
  end
end
