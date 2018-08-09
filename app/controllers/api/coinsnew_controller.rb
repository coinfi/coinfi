class Api::CoinsnewController < ApiController
  def index
    @current_page = params[:page] || 1
    @coins = Coin.select(:id, :ranking, :name, :symbol, :price, :market_cap, :change1h, :change24h, :change7d, :volume24)
      .page(@current_page).per(params[:per]).order(:ranking)

    render json: @coins, methods: :sparkline
  end
end
