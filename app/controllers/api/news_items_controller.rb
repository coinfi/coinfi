class Api::NewsItemsController < ApiController

  def index
    news_item_ids = NewsCoinMention.where(
      coin_id: params[:q][:coin_ids]
    ).pluck(:news_item_id)
    news_items =
      NewsItem
      .ransack(id_in: news_item_ids).result
      .order('feed_item_published_at desc').limit(10)
    respond_success serialized(news_items)
  end

  private

  def serialized(obj)
    obj.as_json(
      only: %i[id title summary feed_item_published_at url],
      methods: %i[coin_ids]
    )
  end

end
