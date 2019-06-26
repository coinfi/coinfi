class Api::IndicatorsController < ApiController
  before_action :authenticate

  include IndicatorsHelper
  include CoinsHelper

  def tickers
    @coins = Coin.where(coin_key: INDICATOR_COIN_KEYS)
    render json: ticker_serializer(@coins)
  end

  def overview
    symbols = params[:symbols].upcase.split(',') if params[:symbols].present?
    return render json: [] if symbols.empty?

    @coins = Coin.where(symbol: symbols).where(coin_key: INDICATOR_COIN_KEYS)

    render json: overview_serializer(@coins)
  end

  private

  def authenticate
    api_key = request.headers['X-Api-Key']
    return if api_key.present? && api_key == ENV.fetch("INDICATORS_API_KEY")

    render json: {}, status: 401
  end

  def ticker_serializer(coins)
    tickers = coins.map{|coin| coin['symbol']}
    { tickers: tickers }
  end

  def overview_serializer(coins)
    coins.map do |coin|
      calculations = get_indicators_and_signals(coin)
      consensus = get_consensus(calculations.dig(:summary_value))

      {
        buy: calculations.dig(:summary, :buy),
        hold: calculations.dig(:summary, :neutral),
        sell: calculations.dig(:summary, :sell),
        companyName: coin.name,
        consensus: consensus,
        ticker: coin.symbol,
      }
    end.to_json
  end

  def get_indicators_and_signals(coin)
    # Expire cache at the same time as Coin.prices_data, i.e., underlying data used to calculate indicators & signals
    Rails.cache.fetch("indicators/#{coin.slug}:data", expires_in: seconds_to_next_day + 1800) do
      calculations = CalculateIndicatorsAndSignals.call(coin)
      calculations.result
    end
  end

  def get_consensus(value)
    if value == 10    # strong sell
      return t(:sell)
    elsif value == 30 # sell
      return t(:sell)
    elsif value == 70 # buy
      return t(:buy)
    elsif value == 90 # strong buy
      return t(:buy)
    else              # neutral (50)
      return t(:neutral)
    end
  end
end