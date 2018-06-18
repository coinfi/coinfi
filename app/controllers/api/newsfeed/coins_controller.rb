class Api::Newsfeed::CoinsController < ApiController

  def index
    coin_ids = Coin.order(:ranking).limit(20).ids
    if current_user
      coin_ids = (coin_ids + current_user.coin_ids).uniq
    end
    coins = Coin.where(id: coin_ids).order(:ranking)
    respond_success index_serializer(coins)
  end

  private

  def index_serializer(coins)
    coins.as_json(
      only: %i[id name image_url symbol slug price_usd],
      methods: %i[market_info]
    )
  end


end
