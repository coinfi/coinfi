class Api::SignalsTelegramBot::SignalsTelegramSubscriptionsController < Api::SignalsTelegramBot::BaseController
  before_action :set_signals_telegram_user
  before_action :set_signals_telegram_subscription, only: [:show, :destroy]

  def index
    subscriptions = @signals_telegram_user.signals_telegram_subscriptions

    json = subscriptions.map { |s| serialize_signals_telegram_subscription(s) }
    render json: json, status: :ok
  end

  def show
    json = serialize_signals_telegram_subscription(@signals_telegram_subscription)
    render json: json, status: :ok
  end

  def create
    coin = Coin.order(ranking: :desc).find_by!(symbol: create_params[:coin_symbol])
    service = WatchCoinService.new(
      user: @signals_telegram_user.user,
      coin: coin,
    )

    if service.call
      json = serialize_signals_telegram_subscription(service.signals_telegram_subscription)
      render json: json, status: :created
    else
      errors = service&.signals_telegram_subscription&.errors || service&.watchlist_item&.errors
      render json: errors, status: :unprocessable_entity
    end
  end

  def destroy
    service = UnwatchCoinService.new(
      user: @signals_telegram_user.user,
      coin: @signals_telegram_subscription.coin
    )

    if service.call
      head :no_content
    else
      render json: nil, status: :unprocessable_entity
    end
  end

  private

  def set_signals_telegram_user
    telegram_id_or_username = params.require(:signals_telegram_user_telegram_id_or_username)
    @signals_telegram_user = SignalsTelegramUser
      .where('telegram_id = ? OR telegram_username ILIKE ?', telegram_id_or_username, telegram_id_or_username)
      .first!
  end

  def set_signals_telegram_subscription
    @signals_telegram_subscription = @signals_telegram_user.signals_telegram_subscriptions
      .joins(:coin)
      .order('coins.ranking DESC')
      .find_by!(coins: { symbol: params.require(:coin_symbol) })
  end

  def create_params
    params.require(:signals_telegram_subscription).permit(:coin_symbol)
  end

  def serialize_signals_telegram_subscription(signals_telegram_subscription)
    coin_json = signals_telegram_subscription.coin.as_json(
      only: %i[id name symbol slug]
    )
    signals_telegram_subscription
      .as_json(
        only: %i[id signals_telegram_user_id],
      )
      .merge("coin": coin_json)
  end
end
