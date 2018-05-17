class Api::Newsfeed::CoinsController < ApiController

  def index
    @coins = Coin.order(:ranking).limit(20)
    respond_success serialized(@coins)
  end

  private

  def serialized coin
    coin.as_json(
      only: [:id, :name, :image_url, :symbol, :slug, :price_usd], 
      methods: [:market_info]
    )
  end

end
