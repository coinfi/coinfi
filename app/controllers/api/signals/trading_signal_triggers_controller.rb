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

  # Action to support bulk creating/updating records
  #
  # A create or update is determined by the `external_id` and whether or not it already corresponds
  # to an existing record
  #
  # Example body
  #   {
  #     "trading_signal_triggers": {
  #       [external_id]: {
  #         "type_key": "token_exchange_transactions",
  #         "params": {
  #           "coin_key": "leverj.io",
  #           "token_address": "0x0f4ca92660efad97a9a70cb0fe969c755439772c",
  #           "amount_threshold": 2400590000000000,
  #           "signal_trigger_count": 1,
  #           "signal_trigger_period_months": 10
  #         }
  #       },
  #       ...
  #     }
  #   }
  def bulk_upsert_by_external_id
    begin
      ActiveRecord::Base.transaction do
        trading_signal_triggers = bulk_upsert_by_external_id_params.to_h.map do |external_id, trading_signal_trigger_attrs|
          # Attempt to find a record by `external_id`, otherwise build a new record
          trading_signal_trigger = TradingSignalTrigger.find_or_initialize_by(external_id: external_id)

          # Remove any fields that should not be changed
          cleaned_trading_signal_trigger_attrs = trading_signal_trigger_attrs.except(:id, :created_at, :updated_at)

          # Apply the changes and save
          trading_signal_trigger.assign_attributes(cleaned_trading_signal_trigger_attrs)
          trading_signal_trigger.save!
          trading_signal_trigger
        end

        render json: serialize_trading_signal_trigger(trading_signal_triggers), status: :ok
      end
    rescue ActiveRecord::RecordInvalid => e
      render json: { errors: [e.message] }, status: :unprocessable_entity
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

  def bulk_upsert_by_external_id_params
    params
      .require(:trading_signal_triggers)
      .permit!
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
