class Api::NewsItemsController < ApiController

  PER_PAGE = 10

  def index
    # Ensure fresh response on every request
    headers['Last-Modified'] = Time.now.httpdate

    q = params[:q] || {}

    @news_items = NewsItem.published.all

    coin_ids = q[:coinIDs]
    coin_ids = Coin.where(name: q[:coins]).pluck(:id) if q[:coins]
    coin_ids = Coin.top(20).pluck(:id) unless coin_ids
    news_item_ids_for_coin_filter = NewsCoinMention.where(coin_id: coin_ids).pluck(:news_item_id)
    @news_items = @news_items.where(id: news_item_ids_for_coin_filter)

    category_ids = NewsCategory.where(name: q[:categories]).pluck(:id)
    news_item_ids_for_category_filter = NewsItemCategorization.where(news_category_id: category_ids).pluck(:news_item_id)
    if news_item_ids_for_category_filter.present?
      @news_items = @news_items.where(id: news_item_ids_for_category_filter)
    end

    feed_source_ids = get_feed_source_ids(q[:feedSources])
    if feed_source_ids.present?
      @news_items = @news_items.where(feed_source_id: feed_source_ids)
    end

    if q[:keywords].present?
      @news_items = @news_items.where('title ILIKE ?', "%#{q[:keywords]}%")
    end

    if q[:publishedSince].present?
      @news_items = @news_items.where('feed_item_published_at > ?', q[:publishedSince].to_datetime)
    end

    if q[:publishedUntil].present?
      @news_items = @news_items.where('feed_item_published_at < ?', q[:publishedUntil].to_datetime)
    end

    @news_items = @news_items.limit(PER_PAGE)

    respond_success serialized(@news_items)
  end

  private

  def get_feed_source_ids(feed_source_names)
    return [] unless feed_source_names.present?
    feed_source_ids = []
    special_sources = []
    special_sources << feed_source_names.delete('twitter')
    special_sources << feed_source_names.delete('reddit')
    special_sources.each do |feed_type|
      feed_source_ids += FeedSource.active.where(feed_type: feed_type).pluck(:id)
    end
    feed_source_ids += FeedSource.active.where(site_hostname: feed_source_names).pluck(:id)
    feed_source_ids
  end

  def serialized(obj)
    obj.as_json(
      only: %i[id title summary feed_item_published_at updated_at url content],
      methods: %i[coin_link_data categories]
    )
  end

end
