class Api::Signals::TradingSignalsController < Api::Signals::BaseController
  before_action :set_trading_signal, only: [:show]

  def show
    json = serialize_trading_signal(@trading_signal)
    render json: json
  end

  def create
    @trading_signal = TradingSignal.new(trading_signal_params)
    if @trading_signal.save
      json = serialize_trading_signal(@trading_signal)
      render json: json, status: :created
    else
      render json: @trading_signal.errors, status: :unprocessable_entity
    end
  end

  private

  def set_trading_signal
    @trading_signal = TradingSignal.find(params[:id])
  end

  def trading_signal_params
    params
      .require(:trading_signal)
      .permit(
        :external_id,
        :trading_signal_trigger_id,
        :trading_signal_trigger_external_id,
        :timestamp,
        extra: {},
      )
  end

  def serialize_trading_signal(trading_signal)
    trading_signal.as_json(
      only: [
        :id,
        :external_id,
        :trading_signal_trigger_id,
        :trading_signal_trigger_external_id,
        :timestamp,
        :extra,
      ],
    )
  end
end
