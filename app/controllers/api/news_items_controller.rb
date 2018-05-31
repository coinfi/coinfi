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
    @news_items = @news_items.ransack(build_query).result
  end

  def build_query
    filter_params.map { |key, value|
      parse_param(key.to_sym, value)
    }.compact.to_h
  end

  def parse_param key, value
    case key
    when :coin_ids
      [:id_in, NewsCoinMention.where(coin_id: value).pluck(:news_item_id)]
    when :search
      [:title_or_summary_cont, value]
    end
  end

  def filter_params
    params.permit! 
    p = HashWithIndifferentAccess.new params[:q]
    return [] unless p
    if p[:hardCap]
      p[:hardCapMin] = p[:hardCap][:min]
      p[:hardCapMax] = p[:hardCap][:max]
    end
    p
  end


end
