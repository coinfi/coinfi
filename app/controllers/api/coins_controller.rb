class Api::CoinsController < ApiController

  def index
    query = params[:q] || {}
    if params[:exclude_watched]
      query[:id_not_in] = current_user.watchlist.coin_ids
    end
    @coins = Coin.ransack(query).result(distinct: true).limit(params[:limit] || 10)
    respond_success index_serializer(@coins)
  end

  def show
    respond_success show_serializer(Coin.find(params[:id]))
  end

  private

  def index_serializer(coin)
    coin.as_json(
      only: %i[id name image_url symbol slug price_usd]
    )
  end

  def show_serializer(coin)
    coin.as_json(
      only: %i[id name image_url symbol slug price_usd],
      methods: %i[prices_data]
    )
  end

end
