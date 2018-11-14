class Api::SignalsTelegramBot::TradingSignalNotificationsController < Api::SignalsTelegramBot::BaseController
  def create
    @trading_signal_notification = TradingSignalNotification.new(trading_signal_notification_params)
    if @trading_signal_notification.save
      render json: @trading_signal_notification, status: :created
    else
      render json: @trading_signal_notification.errors, status: :unprocessable_entity
    end
  end

  private

  def trading_signal_notification_params
    params
      .require(:trading_signal_notification)
      .permit(
        :external_id,
        :trading_signal_id,
        :trading_signal_external_id,
        :user_id,
        :timestamp,
        :extra,
      )
  end
end
