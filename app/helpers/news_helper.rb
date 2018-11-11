module NewsHelper
  def default_news_query
    NewsItems::WithFilters.call(NewsItem.published, published_since: 24.hours.ago)
      .includes(:coins, :news_categories)
      .order_by_published
      .limit(25)
  end

  def backup_default_news_query
    NewsItems::WithFilters.call(NewsItem.published)
      .includes(:coins, :news_categories)
      .order_by_published
      .limit(25)
  end

  def serialize_news_items(news_items)
    data = news_items.as_json(
      only: %i[id title summary feed_item_published_at updated_at url content],
      methods: %i[tag_scoped_coin_link_data categories]
    )
    format_item = Proc.new do |item, *args|
      item
        .except('tag_scoped_coin_link_data')
        .merge({
          coin_link_data: item['tag_scoped_coin_link_data'],
        })
    end

    # Handle both hashes and arrays of hashes
    if (data.kind_of?(Array))
      formatted_data = data.map(&format_item)
    else
      formatted_data = format_item.call(data)
    end
  end

  def get_default_news_items
    Rails.cache.fetch("news") do
      news_items = default_news_query
      if default_news_query.empty?
        news_items = backup_default_news_query
      end

      serialize_news_items(news_items)
    end
  end
end