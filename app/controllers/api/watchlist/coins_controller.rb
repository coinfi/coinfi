class Api::Watchlist::CoinsController < ApiController

  before_action :set_watchlist
  before_action :authenticate_user!

  def index
    if (!has_news_features?)
      respond_unfound
    else
      respond_success serialized(@watchlist.coins)
    end
  end

  def create
    if (!has_news_features?)
      respond_unfound
    else
      @coin = Coin.find(params[:id])
      if @watchlist.coins.find_by_id(@coin.id)
        respond_warning "Coin already added"
      else
        @watchlist.items.create(coin: @coin)
        @watchlist.save
        respond_success "Coin added to watchlist"
      end
    end
  end

  def destroy
    if (!has_news_features?)
      respond_unfound
    else
      if @item = @watchlist.items.find_by_coin_id(params[:id])
        @item.destroy
        respond_success({ id: @item.coin_id }, "Coin removed from watchlist")
      else
        respond_warning "Coin already removed"
      end
    end
  end

  def reorder
    params[:order].each_with_index do |coin_id, position|
      item = @watchlist.items.find_by_coin_id(coin_id)
      item.update(position: position)
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

  def set_watchlist
    @watchlist = current_user.watchlist || Watchlist.create(user: current_user)
  end

  def serialized coin
    coin.as_json(only: [
      :id, :name, :image_url, :symbol, :ico_usd_raised, :ico_fundraising_goal_usd, :ico_end_epoch,
      :max_supply, :ico_token_price_usd, :ico_start_epoch, :slug
    ], methods: [:market_info, :category])
  end

end
