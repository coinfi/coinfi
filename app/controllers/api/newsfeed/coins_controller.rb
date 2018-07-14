class Api::Newsfeed::CoinsController < ApiController

  def index
    if (!has_news_features?)
      respond_unfound
    else
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
  end

  private

  def has_news_feature?
    current_user && $ld_client.variation('news', get_ld_user, false)
  end

  def get_ld_user
    {
      key: current_user.id,
      email: current_user.email,
      anonymous: false,
      custom: {
        username: current_user.username
      }
    }
  end

  def index_serializer(coins)
    coins.as_json(
      only: %i[id name image_url symbol slug price_usd],
      methods: %i[market_info]
    )
  end


end
