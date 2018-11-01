class Api::SignalsTelegramBot::SignalsTelegramUsers::SignalsTelegramSubscriptionsController < Api::SignalsTelegramBot::BaseController
  before_action :set_signals_telegram_user
  before_action :set_subscription, only: [:show, :destroy]

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
    coin = Coin.find_by!(slug: create_params[:coin_slug])
    @signals_telegram_subscription = SignalsTelegramSubscription.new(
      coin: coin,
      signals_telegram_user: @signals_telegram_user,
    )

    respond_to do |format|
      if @signals_telegram_subscription.save
        json = serialize_signals_telegram_subscription(@signals_telegram_subscription)
        render json: json, status: :created
      else
        render json: @signals_telegram_subscription.errors, status: :unprocessable_entity
      end
    end
  end

  def destroy
    if @signals_telegram_subscription.destroy
      head :no_content
    else
      render json: @signals_telegram_subscription.errors, status: :unprocessable_entity
    end
  end

  private

  def set_signals_telegram_user
    @signals_telegram_user = SignalsTelegramUser
      .find_by!(telegram_username: params[:signals_telegram_user_telegram_username])
  end

  def set_signals_telegram_subscription
    @signals_telegram_subscription = @signals_telegram_user.signals_telegram_subscriptions
      .find_by!(coin_slug: params[:coin_slug])
  end

  def create_params
    params.permit(:coin_slug)
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
