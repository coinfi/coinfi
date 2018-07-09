class Api::NewsItemsController < ApiController
  PER_PAGE = 16

  def index
    # Ensure fresh response on every request
    headers['Last-Modified'] = Time.now.httpdate

    @news_items = NewsItem.published.all

    if params[:coins].blank?
      coin_ids = Coin.top(20).ids
    else
      coin_names = params[:coins].split(',')
      coin_ids = Coin.where(name: coin_names).ids
    end
    news_item_ids_for_coin_filter = NewsCoinMention.where(coin_id: coin_ids).pluck(:news_item_id)
    @news_items = @news_items.where(id: news_item_ids_for_coin_filter)

    if params[:coins].blank?
      # Only show NewsItems from General FeedSources when no coins are specifically selected.
      @news_items = NewsItem.general.published.or(@news_items)
    end

    if params[:categories].present?
      category_names = params[:categories].split(',')
      category_ids = NewsCategory.where(name: category_names).pluck(:id)
      news_item_ids_for_category_filter = NewsItemCategorization.where(news_category_id: category_ids).pluck(:news_item_id)
      if news_item_ids_for_category_filter.present?
        @news_items = @news_items.where(id: news_item_ids_for_category_filter)
      end
    end

    if params[:feed_sources].present?
      feed_source_ids = get_feed_source_ids(params[:feed_sources])
      if feed_source_ids.present?
        @news_items = @news_items.where(feed_source_id: feed_source_ids)
      end
    end

    if params[:keywords].present?
      @news_items = @news_items.where('title ILIKE ?', "%#{params[:keywords]}%")
    end

    if params[:published_since].present?
      published_since = Time.at(params[:published_since].to_i).to_datetime
      @news_items = @news_items.where('feed_item_published_at > ?', published_since)
    end

    if params[:published_until].present?
      published_until = Time.at(params[:published_until].to_i).to_datetime
      @news_items = @news_items.where('feed_item_published_at < ?', published_until)
    end

    @news_items = @news_items.limit(PER_PAGE)

    respond_success serialized(@news_items)
  end

  private

  def get_feed_source_ids(feed_source_names)
    return [] unless feed_source_names.present?
    feed_source_names = feed_source_names.split(',')
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
