class Api::SignalsTelegramBot::SignalNotificationsController < Api::SignalsTelegramBot::BaseController
  def create
    @signal_notification = SignalNotification.new(signal_notification_params)
    if @signal_notification.save
      render json: @signal_notification, status: :created
    else
      render json: @signal_notification.errors, status: :unprocessable_entity
    end
  end

  private

  def signal_notification_params
    params
      .require(:signal_notification)
      .permit(
        :external_id,
        :signal_id,
        :signal_external_id,
        :user_id,
        :timestamp,
        :extra,
      )
  end
end
