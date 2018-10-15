class Api::SignalsTelegramBotController < ApiController
  skip_before_action :verify_authenticity_token
  http_basic_authenticate_with name: ENV.fetch('SIGNALS_TELEGRAM_BOT_API_USERNAME'), password: ENV.fetch('SIGNALS_TELEGRAM_BOT_API_PASSWORD')

  def register
    form = SignalsTelegramBotRegistrationForm.new(register_params)
    if form.save
      render json: nil, status: :ok
    else
      errors_json = { details: form.errors.details, messages: form.errors.messages }
      render json: { errors: errors_json }, status: :unprocessable_entity
    end
  end

  def subscribers
    users = User.where("(token_sale->>'signals_telegram_bot_chat_id') IS NOT NULL").select(:token_sale)
    subscribers = users.map do |user|
      {
        telegram_username: user.token_sale['telegram_username'],
        chat_id: user.token_sale['signals_telegram_bot_chat_id'],
        started_at: user.token_sale['signals_telegram_bot_started_at'],
      }
    end

    render json: subscribers.to_json, status: :ok
  end

  private

  def register_params
    params.require(:signals_telegram_bot).permit(
      :telegram_username, :chat_id, :started_at
    )
  end
end
