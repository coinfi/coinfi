module NewsHelper
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

  def get_default_news_items(rewrite_cache: false)
    Rails.cache.fetch("default_news_items", force: rewrite_cache) do
      news_items = NewsServices::RetrieveDefaultNewsItems.call.try(:result)
      serialize_news_items(news_items) if news_items.present?
    end
  end

  def get_news_items_with_votes(json_news_items)
    NewsServices::RetrieveNewsItemsWithVotes.call(
      json_news_items: json_news_items,
      user: current_user
    ).try(:result)
  end
end
