class Api::CoinsnewController < ApiController
  def index
    @current_page = params[:page] || 1
    @coins = Coin.select(:id, :coin_key, :ranking, :image_url, :name, :symbol, :price, :market_cap, :change1h, :change24h, :change7d, :volume24)
      .legit.listed.page(@current_page).per(params[:per]).order(:ranking)

    render json: @coins, methods: :sparkline
  end

  def search
    query = params[:q] || {}
    @coins = Coin.ransack(query).result(distinct: true).limit(params[:limit] || 10).order(:ranking)
    respond_success search_serializer(@coins)
  end

  # TODO: Move toplist and watchlist methods here when refactoring.

private

  def search_serializer(coins)
    coins.as_json(only: %i[id name symbol slug])
  end
end
