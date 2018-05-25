class Api::NewsItemsController < ApiController

  def index
    @news_items = NewsItem.includes(:news_coin_mentions)
      .where('news_coin_mentions.coin_id = ?', params[:q][:coin_ids_any])
      .order('feed_item_published_at desc').limit(10)
    respond_success serialized(@news_items)
  end

  private

  def serialized(obj)
    obj.as_json(only: %i[id title summary feed_item_published_at url])
  end

end
