class NewsItem < ApplicationRecord
  belongs_to :feed_source

  def self.ingest!(feed_item, source)
    news_item = NewsItem.create(websub_hub: 'superfeedr', feed_item_json: feed_item)
    news_item.process!(source)
  end

  def process!(source)
    item = HashWithIndifferentAccess.new(feed_item_json)
    feed_source = FeedSource.find(source)

    update(
      feed_item_id: item[:id],
      feed_source: feed_source,
      url: item[:permalinkUrl],
      title: item[:title],
      summary: item[:summary],
      content: item[:content],
      actor_id: item[:actor][:id],
      feed_item_published_at: DateTime.strptime(item[:published].to_s, '%s'),
      feed_item_updated_at: DateTime.strptime(item[:updated].to_s, '%s'),
      is_processed: true
    )
  end
end
