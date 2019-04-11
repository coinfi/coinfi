class Api::UserController < ApiController
  include CurrencyHelper

  skip_before_action :verify_authenticity_token
  before_action :set_watchlist

  def show
    respond_success(nil) and return unless current_user
    respond_success(serialized(current_user))
  end

  def update
    respond_warning("User not logged in") and return unless current_user
    set_default_currency(params[:currency]) if params[:currency]
    set_theme(params[:theme]) if params[:theme]
    set_default_to_trading_view(params[:trading_view]) unless params[:trading_view].nil?
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

  def set_default_currency(currency)
    if has_currency?(currency)
      current_user.update(default_currency: currency)
    end
  end

  def set_theme(theme)
    current_user.set_theme(theme)
  end

  def set_default_to_trading_view(setting)
    current_user.set_default_to_trading_view(setting)
  end

  def serialized(user)
    user.as_json(
      only: %i[email, default_currency],
      methods: %i[coin_ids theme trading_view]
    )
  end

  def set_watchlist
    return unless current_user
    @watchlist = current_user.watchlist || Watchlist.create(user: current_user)
  end

end
