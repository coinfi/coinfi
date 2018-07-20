class Api::Watchlist::CoinsController < ApiController
  prepend_before_action :authenticate_user!
  before_action :set_watchlist, :detect_news_feature

  def index
    respond_success serialized(@watchlist.coins)
  end

  def create
    @coin = Coin.find(params[:id])
    if @watchlist.coins.find_by_id(@coin.id)
      respond_warning "Coin already added"
    else
      @watchlist.items.create(coin: @coin)
      @watchlist.save
      respond_success "Coin added to watchlist"
    end
  end

  def destroy
    if @item = @watchlist.items.find_by_coin_id(params[:id])
      @item.destroy
      respond_success({ id: @item.coin_id }, "Coin removed from watchlist")
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
      :id, :name, :image_url, :symbol, :ico_usd_raised, :ico_fundraising_goal_usd, :ico_end_epoch,
      :max_supply, :ico_token_price_usd, :ico_start_epoch, :slug
    ], methods: [:market_info, :category])
  end
end
