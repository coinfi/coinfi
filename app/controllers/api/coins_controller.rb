class Api::CoinsController < ApiController

  def index
    query = { name_or_symbol_cont: params[:q][:search] }
    if params[:exclude_watched]
      query[:id_not_in] = current_user.watchlist.coin_ids
    end
    @coins = Coin.ransack(query).result(distinct: true).limit(params[:limit] || 10)
    respond_success serialized(@coins)
  end

  private

  def serialized coin
    coin.as_json(only: [:id, :name, :image_url, :symbol, :slug, :price_usd])
  end

end
