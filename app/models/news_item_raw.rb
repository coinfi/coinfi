class NewsItemRaw < ApplicationRecord
  belongs_to :news_item, optional: true

  scope :unprocessed, -> { where(is_processed: false)}

  def self.ingest!(feed_item, source)
    begin
      raw_item = NewsItemRaw.create!(feed_item_id: feed_item[:id], source: source, websub_hub: 'superfeedr', feed_item_json: feed_item)
      raw_item.process!
    rescue StandardError => e
      e.rollbar_context = { feed_item: feed_item }
      raise
    end
  end

  def self.clean_content_html(content_html)
    parsed_content_html = Nokogiri::HTML::DocumentFragment.parse(content_html)

    # Remove any <li> elements with <i> with no children (or ss as child)
    parsed_content_html.xpath('*//li[i[ss or not(.//* or @* or text())]]').remove()

    parsed_content_html.to_html()
  end

  def self.strip_title_html(title_html)
    parsed_title_html = Nokogiri::HTML::DocumentFragment.parse(title_html)

    parsed_title_html.text
  end

  def process!
    begin
      news_item = NewsItem.create!(news_item_params)
    rescue ActiveRecord::RecordNotUnique => e
      news_item = NewsItem.find_by( feed_item_id: feed_item_id, feed_source: feed_source)
      previous_raw = news_item.news_item_raw
      self.destroy and return if previous_raw.present? && feed_item_json == previous_raw.feed_item_json
      self.destroy and return if news_item.feed_item_updated_at > feed_item_updated_at

      news_item.update!(news_item_params) #something changed and it seems more recent than what we had before so let's update

      previous_raw.update!(news_item: nil, was_replaced_by_an_update: true) if previous_raw.present?
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

    published = item[:published].presence || item.dig(:source, :published)
    updated = item[:updated].presence || item.dig(:source, :updated)

    @news_item_params = {
      feed_item_id: feed_item_id,
      feed_source: feed_source,
      url: item[:permalinkUrl],
      title: self.class.strip_title_html(item[:title]),
      summary: item[:summary],
      content: self.class.clean_content_html(item[:content]),
      actor_id: actor_id,
      feed_item_published_at: parse_timestamp(published),
      feed_item_updated_at: parse_timestamp(updated),
    }
  end

  def item
    @item ||= ActiveSupport::HashWithIndifferentAccess.new(feed_item_json)
  end

  def actor_id
    item.try(:[], :actor).try(:[], :id)
  end

  def feed_item_updated_at
    item["updated"]
  end

  def parse_timestamp(timestamp)
    return nil unless timestamp.present?
    timestamp_string = timestamp.to_s
    if timestamp_string !~ /\D/
      DateTime.strptime(timestamp_string, '%s')
    else
      DateTime.strptime(timestamp_string)
    end
  end
end
