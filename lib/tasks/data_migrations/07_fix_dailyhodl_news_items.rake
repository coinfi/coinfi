require_relative '../batch_process'

namespace :data_migrations do
  desc 'Fix dailyhodl news items to remove empty list items'
  task :fix_dailyhodl_newsitems => :environment do
    dailyhodl_source = FeedSource.where(slug: 'the-daily-hodl').pluck(:id)

    batch_process(NewsItem.where(feed_source_id: dailyhodl_source)) do |news_item|
        cleaned_content = NewsItemRaw.clean_content_html(news_item.content)
        news_item.update(content: cleaned_content)
    end
  end
end
