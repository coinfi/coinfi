class Api::Signals::TradingSignalTriggersController < Api::Signals::BaseController
  before_action :set_trading_signal_trigger, only: [:show]

  def index
    @trading_signal_triggers = TradingSignalTrigger.all
    @trading_signal_triggers.map(serialize_trading_signal_trigger)
  end

  def show
    json = serialize_trading_signal_trigger(@trading_signal_trigger)
    render json: json
  end

  def create
    @trading_signal_trigger = TradingSignalTrigger.new(trading_signal_trigger_params)
    if @trading_signal_trigger.save
      json = serialize_trading_signal_trigger(@trading_signal_trigger)
      render json: json, status: :created
    else
      render json: @trading_signal_trigger.errors, status: :unprocessable_entity
    end
  end

  private

  def set_trading_signal_trigger
    @trading_signal_trigger = TradingSignalTrigger.find(params[:id])
  end

  def trading_signal_trigger_params
    params
      .require(:trading_signal_trigger)
      .permit(
        :external_id,
        :type_key,
        params: {},
      )
  end

  def serialize_trading_signal_trigger(trading_signal_trigger)
    trading_signal_trigger.as_json(
      only: [
        :id,
        :external_id,
        :type_key,
        :params,
      ],
    )
  end
end
