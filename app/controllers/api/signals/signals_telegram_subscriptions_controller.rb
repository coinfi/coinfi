class Api::Signals::SignalsTelegramSubscriptionsController < Api::Signals::BaseController
  before_action :set_signals_telegram_user
  before_action :set_signals_telegram_subscription, only: [:show]

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
    form = ::SignalsTelegramBot::WatchCoinForm.new(
      create_params.merge(
        signals_telegram_user: @signals_telegram_user,
      )
    )

    if form.save
      json = serialize_signals_telegram_subscription(form.service.signals_telegram_subscription)
      render json: json, status: :created
    else
      errors_json = { details: form.errors.details, messages: form.errors.messages }
      render json: { errors: errors_json }, status: :unprocessable_entity
    end
  end

  def destroy
    form = ::SignalsTelegramBot::UnwatchCoinForm.new(
      signals_telegram_user: @signals_telegram_user,
      coin_symbol: params.require(:coin_symbol),
    )

    if form.save
      head :no_content
    else
      errors_json = { details: form.errors.details, messages: form.errors.messages }
      render json: { errors: errors_json }, status: :unprocessable_entity
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
      .find_by!(coins: { symbol: params.require(:coin_symbol).upcase })
  end

  def create_params
    params
      .require(:signals_telegram_subscription)
      .permit(:coin_symbol)
  end

  def serialize_signals_telegram_subscription(signals_telegram_subscription)
    coin_json = signals_telegram_subscription.coin
      .as_json(
        only: %i[id name symbol slug coin_key]
      )
      .merge({
        is_signals_supported_erc20: signals_telegram_subscription.coin.is_signals_supported_erc20?
      })

    signals_telegram_subscription
      .as_json(
        only: %i[id signals_telegram_user_id],
      )
      .merge("coin": coin_json)
  end
end
