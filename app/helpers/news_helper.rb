module NewsHelper
  def serialize_news_items(news_items)
    data = news_items.as_json(
      only: %i[id title summary feed_item_published_at updated_at url content],
      methods: %i[tag_scoped_coin_link_data categories vote_score]
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

  def serialize_user_news_votes(votable_items)
    votable_items.map do |item|
      {
        "news_item_id": item.votable_id,
        "user_vote": item.vote_flag,
      }
    end
  end

  def get_default_news_item_ids(rewrite_cache: false)
    rewrite_cache = true unless Rails.env.production?
    Rails.cache.fetch("default_news_item_ids", force: rewrite_cache) do
      news_items = NewsServices::RetrieveDefaultNewsItems.call.try(:result)
      news_items.pluck(:id) if news_items.present?
    end
  end

  def get_favicon_link(url)
    parsedUrl = URI(url)
    "https://www.google.com/s2/favicons?domain=#{parsedUrl.host}"
  end

  def link_to_news_item(url, html_options = {})
    html_options = {
      target: "_blank",
      rel: "noopener noreferrer nofollow"
    }.merge(html_options)
    parsedUrl = URI(url)
    link_to(parsedUrl.host, url, html_options)
  end
end
