class Api::Newsfeed::CoinsController < ApiController

  def index
    @coins = Coin.order(:ranking).limit(20)
    respond_success index_serializer(@coins)
  end

  private

  def index_serializer(coins)
    coins.as_json(
      only: %i[id name image_url symbol slug price_usd],
      methods: %i[market_info]
    )
  end


end
