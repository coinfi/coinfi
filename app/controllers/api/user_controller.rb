class Api::UserController < ApiController

  skip_before_action :verify_authenticity_token
  before_action :set_watchlist

  def show
    respond_success(nil) and return unless current_user
    respond_success(serialized(current_user))
  end

  def update
    respond_warning("User not logged in") and return unless current_user
    watch_coin(params[:watchCoin]) if params[:watchCoin]
    unwatch_coin(params[:unwatchCoin]) if params[:unwatchCoin]
    respond_success(serialized(current_user))
  end

  private

  def watch_coin(coin_id)
    unless @watchlist.coins.where(id: coin_id).exists?
      WatchCoinService.call(user: current_user, coin: Coin.find(coin_id))
    end
  end

  def unwatch_coin(coin_id)
    UnwatchCoinService.call(user: current_user, coin: Coin.find(coin_id))
  end

  def serialized(user)
    user.as_json(
      only: %i[email],
      methods: %i[coin_ids]
    )
  end

  def set_watchlist
    return unless current_user
    @watchlist = current_user.watchlist || Watchlist.create(user: current_user)
  end

end
