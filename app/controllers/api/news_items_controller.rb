class Api::NewsItemsController < ApiController

  PER_PAGE = 10

  def index
    q = params[:q] || {}

    @news_items = NewsItem.all

    if q[:coinIDs]
      news_item_ids_for_coin_filter = NewsCoinMention.where(coin_id: q[:coinIDs]).pluck(:news_item_id)
      @news_items = @news_items.where(id: news_item_ids_for_coin_filter)
    end

    category_ids = NewsCategory.where(name: q[:categories]).pluck(:id)
    news_item_ids_for_category_filter = NewsItemCategorization.where(news_category_id: category_ids).pluck(:news_item_id)
    @news_items = @news_items.where(id: news_item_ids_for_category_filter) if news_item_ids_for_category_filter.present?
    
    feed_source_ids = get_feed_source_ids(q[:feedSources])
    @news_items = @news_items.where(feed_source_id: feed_source_ids) if feed_source_ids.present? 

    @news_items = @news_items.where('title ILIKE ?', "%#{q[:keywords]}%") if q[:keywords].present?

    @news_items = @news_items.where('feed_item_published_at > ?', q[:publishedSince].to_datetime) if q[:publishedSince].present?
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
      feed_source_ids += FeedSource.where(feed_type: feed_type).pluck(:id)
    end
    feed_source_ids += FeedSource.where(site_hostname: feed_source_names).pluck(:id)
    feed_source_ids
  end

  def serialized(obj)
    obj.as_json(
      only: %i[id title summary feed_item_published_at updated_at url content],
      methods: %i[coin_link_data categories]
    )
  end

end
