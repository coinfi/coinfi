class Api::SignalsTelegramSubscriptionsController < ApiController
  def register
    form = SignalsTelegramSubscriptionRegistrationForm.new(register_params)
    if form.save
      render json: nil, status: :ok
    else
      errors_json = form.errors.extract(:details, :messages)
      render json: { errors: errors_json }, status: :unprocessable_entity
    end
  end

  def index
    users = User.where("(token_sale->>'signals_telegram_chat_id') IS NOT NULL").select(:token_sale)
    subscriptions = users.map do |user|
      {
        telegram_username: user.token_sale.telegram_username,
        telegram_chat_id: user.token_sale.signals_telegram_chat_id,
        started_at: user.token_sale.signals_telegram_started_at,
      }
    end

    render json: subscriptions.to_json, status: :ok
  end

  private

  def register_params
    params.require(:signals_telegram_subscription).permit(
      :telegram_username, :telegram_chat_id, :started_at
    )
  end
end
