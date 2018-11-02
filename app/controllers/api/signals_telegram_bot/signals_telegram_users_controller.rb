class Api::SignalsTelegramBot::SignalsTelegramUsersController < Api::SignalsTelegramBot::BaseController
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

  def show
    signals_telegram_user = SignalsTelegramUser.find_by(telegram_username: params[:telegram_username])

    json = serialize_signals_telegram_user(u)
    render json: json, status: :ok
  end

  def register
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

  def serialize_signals_telegram_user(signals_telegram_user)
    signals_telegram_user.as_json(
      only: %i[id user_id telegram_username telegram_chat_id started_at is_active],
    )
  end

  def index_params
    params.permit(
      :is_active
    )
  end

  def register_params
    params.require(:signals_telegram_user).permit(
      :telegram_username, :telegram_chat_id, :started_at
    )
  end
end
