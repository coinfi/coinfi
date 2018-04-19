class NewsItemRaw < ApplicationRecord
  belongs_to :news_item, optional: true

  def self.ingest!(feed_item, source)
    raw_item = NewsItemRaw.create!(feed_item_id: feed_item[:id], source: source, websub_hub: 'superfeedr', feed_item_json: feed_item)
    raw_item.process!
  end

  def process!
    item = HashWithIndifferentAccess.new(feed_item_json)
    feed_source = FeedSource.find(source)

    news_item = NewsItem.create!(
      feed_item_id: feed_item_id,
      feed_source: feed_source,
      url: item[:permalinkUrl],
      title: item[:title],
      summary: item[:summary],
      content: item[:content],
      actor_id: item[:actor][:id],
      feed_item_published_at: DateTime.strptime(item[:published].to_s, '%s'),
      feed_item_updated_at: DateTime.strptime(item[:updated].to_s, '%s'),
    )

    NewsItemRaw.update(is_processed: true, news_item: news_item)
  end
end
