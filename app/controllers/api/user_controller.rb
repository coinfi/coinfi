class Api::UserController < ApiController
  skip_before_action :verify_authenticity_token
  before_action :set_watchlist

  def show
    respond_success(serialized(current_user))
  end

  def update
    watch_coin(params[:watchCoin]) if params[:watchCoin]
    unwatch_coin(params[:unwatchCoin]) if params[:unwatchCoin]
    set_dark_mode(params[:isDarkMode]) if params[:isDarkMode]
    respond_success(serialized(current_user))
  end

  private

  def watch_coin(coin_id)
    unless @watchlist.coins.find_by_id(coin_id)
      @watchlist.items.create(coin_id: coin_id)
    end
  end

  def unwatch_coin(coin_id)
    item = @watchlist.items.find_by_coin_id(coin_id)
    item.destroy if item
  end

  def set_dark_mode(is_dark)
    current_user.token_sale["dark_mode"] = is_dark
    current_user.save
  end

  def serialized(user)
    user.as_json(
      only: %i[email],
      methods: %i[coin_ids]
    )
  end

  def set_watchlist
    respond_warning("User not logged in") and return unless current_user
    @watchlist = current_user.watchlist || Watchlist.create(user: current_user)
  end
end
