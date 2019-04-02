class Api::Newsfeed::CoinsController < ApiController
  def index
    if params[:q] && params[:q][:coinIDs]
      coin_ids = params[:q][:coinIDs]
    else
      coin_ids = Coin.order(:ranking).limit(20).pluck(:id)
    end
    if current_user
      coin_ids = (coin_ids + current_user.coin_ids).uniq
    end
    coins = Coin.where(id: coin_ids).order(:ranking)
    respond_success index_serializer(coins)
  end

  private

  def index_serializer(coins)
    coins.as_json(
      only: %i[id name symbol slug],
      methods: %i[market_info image_url]
    )
  end
end
