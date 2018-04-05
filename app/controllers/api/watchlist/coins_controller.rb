class Api::Watchlist::CoinsController < ApiController

  include Api::Watchlist::Concerns
  before_action :authenticate_user!

  def index
    respond_success serialized(@watchlist.coins)
  end

  def show
    @coin = @watchlist.coins.find_by_id(params[:id])
    respond_success serialized(@coin) || {}
  end

  def create
    @coin = Coin.find(params[:id])
    if @watchlist.coins.find_by_id(@coin.id)
      respond_warning "Coin already added"
    else
      @watchlist.coins << @coin
      @watchlist.save
      respond_success "Coin added to watchlist"
    end
  end

  def destroy
    if @coin = @watchlist.coins.find_by_id(params[:id])
      @watchlist.coins.delete(@coin)
      respond_success({ id: @coin.id }, "Coin removed from watchlist")
    else
      respond_warning "Coin already removed"
    end
  end

  private

  def serialized coin
    coin.as_json(only: [
      :id, :name, :image_url, :symbol, :ico_usd_raised, :ico_fundraising_goal_usd, :ico_end_date,
      :max_supply, :ico_token_price_usd, :ico_start_date, :slug
    ], methods: [:market_info, :category])
  end

end