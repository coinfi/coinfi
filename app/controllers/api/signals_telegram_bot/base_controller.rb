class Api::SignalsTelegramBot::BaseController < ApiController
  skip_before_action :verify_authenticity_token
  http_basic_authenticate_with name: ENV.fetch('SIGNALS_TELEGRAM_BOT_API_USERNAME'), password: ENV.fetch('SIGNALS_TELEGRAM_BOT_API_PASSWORD')
end
