class Api::NewsItemsController < ApiController

  def index
    @news_items = NewsItem
    apply_filters
    @news_items = @news_items.order('feed_item_published_at desc').limit(10)
    respond_success serialized(@news_items)
  end

  private

  def serialized(obj)
    obj.as_json(
      only: %i[id title summary feed_item_published_at updated_at url],
      methods: %i[coin_ids]
    )
  end

  def apply_filters
    return if filter_params.empty?
    filtered_ids = []
    if coin_ids = filter_params[:coin_ids]
      filtered_ids += NewsCoinMention.where(coin_id: coin_ids).pluck(:news_item_id)
    end
    if feed_types = filter_params[:feedSources]
      source_ids = FeedSource.where(feed_type: feed_types).pluck(:id)
      filtered_ids += NewsItem.where(feed_source_id: source_ids).pluck(:id)
    end
    @news_items = @news_items
    .ransack({id_in:filtered_ids.uniq}.merge(build_query))
    .result(distinct: true)
  end

  def build_query
    filter_params.map { |key, value|
      parse_param(key.to_sym, value)
    }.compact.to_h
  end

  def parse_param key, value
    case key
    when :search
      [:title_or_summary_cont, value]
    end
  end

  def filter_params
    params.permit! 
    p = HashWithIndifferentAccess.new params[:q]
    return p || []
  end


end
