class Api::NewsItemsController < ApiController

  def index
    @news_items = NewsItem.ransack(news_item_query).result(distinct: true)
    @news_items = @news_items.order('updated_at desc').limit(10)
    respond_success serialized(@news_items)
  end

  private

  def news_item_query
    p = news_params
    query = {
      id_in: NewsCoinMention.where(coin_id: p[:coinIDs]).pluck(:news_item_id)
    }
    if p[:feedSources] || p[:categories]
      # TODO: find sane way of filtering by multiple associations
      if p[:feedSources]
        source_ids = FeedSource.where(feed_type: p[:feedSources]).pluck(:id)
        query[:id_in] &= NewsItem.where(feed_source_id: source_ids).pluck(:id)
      end
      if p[:categories]
        category_ids = NewsCategory.where(name: p[:categories]).pluck(:id)
        query[:id_in] &= NewsItemCategorization.where(
          news_category_id: category_ids
        ).pluck(:news_item_id)
      end
      query[:id_in] << -1 if query[:id_in].empty? # Ransack returns all results if empty
    end
    query[:title_or_summary_cont] = p[:search] if p[:search]
    query[:updated_at_gt] = p[:updatedSince].to_datetime if p[:updatedSince]
    query
  end

  def news_params
    params.permit!
    p = HashWithIndifferentAccess.new(params[:q]) || {}
    p[:coinIDs] = [] unless p[:coinIDs]
    p
  end

  def serialized(obj)
    obj.as_json(
      only: %i[id title summary feed_item_published_at updated_at url content],
      methods: %i[coin_link_data categories]
    )
  end

end
