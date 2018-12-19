class Api::Signals::SignalsTelegramUsersController < Api::Signals::BaseController
  before_action :set_signals_telegram_user, only: [:show]

  def index
    if index_params.has_key?(:is_active)
      is_active = JSON.parse(index_params[:is_active])
      signals_telegram_users = is_active ? SignalsTelegramUser.active : SignalsTelegramUser.inactive
    else
      signals_telegram_users = SignalsTelegramUser.all
    end

    json = signals_telegram_users.map { |u| serialize_signals_telegram_user(u) }
    render json: json, status: :ok
  end

  def for_trading_signal_notifications
    signals_telegram_users = ::SignalsTelegramUsers::ForTradingSignalNotificationsQuery.call(
      coin_key: for_trading_signal_notifications_params[:coin_key],
      trading_signal_trigger_external_id: for_trading_signal_notifications_params[:trading_signal_trigger_external_id]
    )

    json = signals_telegram_users.map { |u| serialize_signals_telegram_user(u) }
    render json: json, status: :ok
  end

  def show
    json = serialize_signals_telegram_user(@signals_telegram_user)
    render json: json, status: :ok
  end

  def register
    # Skip registration if user already exists
    signals_telegram_user = SignalsTelegramUser.find_by(
      'telegram_id = ? OR telegram_username ILIKE ?',
      register_params[:telegram_id].to_s,
      register_params[:telegram_username]
    )
    if signals_telegram_user
      json = serialize_signals_telegram_user(signals_telegram_user)
      return render json: json, status: :ok
    end

    form = ::SignalsTelegramBot::RegistrationForm.new(register_params)
    if form.save
      json = serialize_signals_telegram_user(form.signals_telegram_user)
      render json: json, status: :ok
    else
      errors_json = { details: form.errors.details, messages: form.errors.messages }
      render json: { errors: errors_json }, status: :unprocessable_entity
    end
  end

  private

  def set_signals_telegram_user
    telegram_id_or_username = params.require(:telegram_id_or_username)
    @signals_telegram_user = SignalsTelegramUser
      .where('telegram_id = ? OR telegram_username ILIKE ?', telegram_id_or_username, telegram_id_or_username)
      .first!
  end

  def serialize_signals_telegram_user(signals_telegram_user)
    subscribed_coin_keys = signals_telegram_user.subscribed_coins.map(&:coin_key)
    signals_telegram_user.as_json(
        only: %i[id user_id telegram_id telegram_username telegram_chat_id started_at is_active],
      )
      .merge("subscribed_coin_keys" => subscribed_coin_keys)
  end

  def index_params
    params.permit(
      :is_active
    )
  end

  def for_trading_signal_notifications_params
    params.permit(
      :coin_key,
      :trading_signal_trigger_external_id
    )
  end

  def register_params
    params.require(:signals_telegram_user).permit(
      :telegram_id, :telegram_username, :telegram_chat_id, :started_at
    )
  end
end
