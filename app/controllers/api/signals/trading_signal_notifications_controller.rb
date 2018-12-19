class Api::Signals::TradingSignalNotificationsController < Api::Signals::BaseController
  before_action :set_trading_signal_notification, only: [:show]

  def show
    json = serialize_trading_signal_notification(@trading_signal_notification)
    render json: json
  end

  def create
    @trading_signal_notification = TradingSignalNotification.new(trading_signal_notification_params)
    if @trading_signal_notification.save
      json = serialize_trading_signal_notification(@trading_signal_notification)
      render json: json, status: :created
    else
      render json: @trading_signal_notification.errors, status: :unprocessable_entity
    end
  end

  private

  def set_trading_signal_notification
    @trading_signal_notification = TradingSignalNotification.find(params[:id])
  end

  def trading_signal_notification_params
    params
      .require(:trading_signal_notification)
      .permit(
        :external_id,
        :trading_signal_id,
        :trading_signal_external_id,
        :user_id,
        :timestamp,
        extra: {},
      )
  end

  def serialize_trading_signal_notification(trading_signal_notification)
    trading_signal_notification.as_json(
      only: [
        :id,
        :external_id,
        :trading_signal_id,
        :trading_signal_external_id,
        :user_id,
        :timestamp,
        :extra,
      ],
    )
  end
end
