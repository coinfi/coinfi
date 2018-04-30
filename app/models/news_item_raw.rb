class NewsItemRaw < ApplicationRecord
  belongs_to :news_item, optional: true

  scope :unprocessed, -> { where(is_processed: false)}

  def self.ingest!(feed_item, source)
    raw_item = NewsItemRaw.create!(feed_item_id: feed_item[:id], source: source, websub_hub: 'superfeedr', feed_item_json: feed_item)
    raw_item.process!
  end

  def process!
    begin
      news_item = NewsItem.create!(news_item_params)
    rescue ActiveRecord::RecordNotUnique => e
      news_item = NewsItem.find_by( feed_item_id: feed_item_id, feed_source: feed_source)
      previous_raw = news_item.news_item_raw
      self.destroy and return if feed_item_json == previous_raw.feed_item_json
      self.destroy and return if news_item.feed_item_updated_at > feed_item_updated_at

      news_item.update!(news_item_params) #something changed and it seems more recent than what we had before so let's update

      previous_raw.update!(news_item: nil, was_replaced_by_an_update: true)
      update!(is_processed: true, news_item: news_item)
    end

    update!(is_processed: true, news_item: news_item)
    feed_source.update(last_received_data_at: Time.now)
  end

  def feed_source
    @feed_source ||= FeedSource.find(source)
  end

  private

  def news_item_params
    return @news_item_params if @news_item_params

    @news_item_params = {
      feed_item_id: feed_item_id,
      feed_source: feed_source,
      url: item[:permalinkUrl],
      title: item[:title],
      summary: item[:summary],
      content: item[:content],
      actor_id: actor_id,
      feed_item_published_at: DateTime.strptime(item[:published].to_s, '%s'),
      feed_item_updated_at: DateTime.strptime(item[:updated].to_s, '%s'),
    }
  end

  def item
    @item ||= HashWithIndifferentAccess.new(feed_item_json)
  end

  def actor_id
    item.try(:[], :actor).try(:[], :id)
  end

  def feed_item_updated_at
    item["updated"]
  end
end
