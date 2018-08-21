class Api::CoinsController < ApiController
  def index
    query = params[:q] || {}
    if params[:exclude_watched]
      query[:id_not_in] = current_user.watchlist.coin_ids
    end
    @coins = Coin.ransack(query).result(distinct: true).limit(params[:limit] || 10).order(:ranking)
    respond_success index_serializer(@coins)
  end

  def show
    coin = Coin.find(params[:id])
    coin.current_user = current_user
    respond_success show_serializer(coin)
  end

  def by_slug
    coin = Coin.find_by(slug: params[:slug])
    coin.current_user = current_user
    respond_success show_serializer(coin)
  end

  def toplist
    coins = Rails.cache.fetch("coins/toplist", expires_in: 1.hour) do
      Coin.order(:ranking).limit(20)
    end
    respond_success coinlist_serializer(coins)
  end

  def watchlist
    coins = current_user.watchlist.coins.order(:ranking)
    respond_success coinlist_serializer(coins)
  end

  private

  def coinlist_serializer(coins)
    coins.as_json(
      only: %i[id name symbol slug price_usd],
      methods: %i[market_info]
    )
  end

  def index_serializer(coins)
    coins.as_json(
      only: %i[id name image_url symbol slug price_usd],
      methods: %i[market_info prices_data]
    )
  end

  def show_serializer(coin)
    coin.as_json(
      only: %i[id name image_url symbol slug price_usd],
      methods: %i[prices_data news_data market_info is_being_watched]
    )
  end
end
