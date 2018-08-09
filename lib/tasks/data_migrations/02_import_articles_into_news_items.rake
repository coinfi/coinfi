require_relative '../batch_process'

namespace :data_migrations do
  task :import_articles_into_news_items => :environment do
    old_article_feed_source = FeedSource.find_or_create_by(
      name: 'Old Coinfi Articles',
      is_active: false,
      feed_url: '',
      site_hostname: '',
    )

    batch_process(Article.all) do |article|
      news_item = NewsItem.find_or_create_by(
        feed_source: old_article_feed_source,
        feed_item_id: article.url,
        url: article.url,
        title: article.title,
        summary: article.summary,
        feed_item_published_at: article.published_date,
        feed_item_updated_at: article.updated_at,
      )
      mention = NewsCoinMention.find_or_create_by(
        coin_id: article.coin_id,
        news_item_id: news_item.id
      )
      puts "Created NewsItem(#{news_item.id}) + NewsCoinMention(#{mention.id})"
    end
  end
end
