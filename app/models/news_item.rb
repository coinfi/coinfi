class NewsItem < ApplicationRecord
  def self.ingest!(feed_item)
    news_item = NewsItem.create(websub_hub: 'superfeedr', feed_item_json: feed_item)
    news_item.process!
  end

  def process!
    item = HashWithIndifferentAccess.new(feed_item_json)
    update(
      feed_item_id: item[:id],
      source_domain: URI.parse(item[:permalinkUrl]).host.downcase,
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
