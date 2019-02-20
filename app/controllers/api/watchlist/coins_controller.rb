class Api::Watchlist::CoinsController < ApiController
  prepend_before_action :authenticate_user!
  before_action :set_watchlist

  def index
    respond_success serialized(@watchlist.coins)
  end

  def create
    @coin = Coin.find(params[:id])
    if @watchlist.coins.where(id: @coin.id).exists?
      respond_warning "Coin already added"
    else
      WatchCoinService.call(user: current_user, coin: @coin)
      respond_success "Coin added to watchlist"
    end
  end

  def destroy
    if @coin = @watchlist.coins.find_by_id(params[:id])
      UnwatchCoinService.call(user: current_user, coin: @coin)
      respond_success({ id: @coin.id }, "Coin removed from watchlist")
    else
      respond_warning "Coin already removed"
    end
  end

  def reorder
    params[:order].each_with_index do |coin_id, position|
      item = @watchlist.items.find_by_coin_id(coin_id)
      item.update(position: position)
    end
  end

  private

  def set_watchlist
    @watchlist = current_user.watchlist || Watchlist.create(user: current_user)
  end

  def serialized coin
    coin.as_json(only: [
      :id, :name, :symbol, :ico_usd_raised, :ico_fundraising_goal_usd, :ico_end_epoch,
      :ico_token_price_usd, :ico_start_epoch, :slug
    ], methods: [:max_supply, :market_info, :category, :image_url])
  end
end
