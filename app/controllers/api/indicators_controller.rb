class Api::IndicatorsController < ApiController
  before_action :authenticate
  skip_before_action :verify_authenticity_token

  include IndicatorsHelper
  include CoinsHelper

  def tickers
    tickers_json = Rails.cache.fetch("indicators/tickers", expires_in: cache_expiry) do
      @coins = Coin.where(coin_key: INDICATOR_COIN_KEYS)
      ticker_serializer(@coins)
    end
    render json: tickers_json
  end

  def overview
    tickers = params[:tickers].upcase.split(',') if params[:tickers].present?
    return render json: [] if tickers.blank?

    overview_json = Rails.cache.fetch("indicators/overview/#{tickers}", expires_in: cache_expiry) do
      symbols = tickers.map {|ticker| ticker_name_to_symbol(ticker)}
      @coins = Coin.where(symbol: symbols).where(coin_key: INDICATOR_COIN_KEYS)
      overview_serializer(@coins)
    end

    render json: overview_json
  end

  private

  def authenticate
    api_key = request.headers['X-APIToken'] || request.headers['X-API-Key']
    return if api_key.present? && api_key == ENV.fetch("INDICATORS_API_KEY")

    render plain: '', status: 401
  end

  def ticker_serializer(coins)
    tickers = coins.map {|coin| symbol_to_ticker_name(coin.symbol)}
    { tickers: tickers }
  end

  def overview_serializer(coins)
    coins.map do |coin|
      calculations = get_indicators_and_signals(coin)
      consensus = get_consensus_string(calculations.dig(:summary_value))
      ticker = symbol_to_ticker_name(coin.symbol)

      {
        buy: calculations.dig(:summary, :buy),
        hold: calculations.dig(:summary, :neutral),
        sell: calculations.dig(:summary, :sell),
        companyName: coin.name,
        consensus: consensus,
        ticker: ticker,
      }
    end
  end

  def get_indicators_and_signals(coin)
    # Expire cache at the same time as Coin.prices_data, i.e., underlying data used to calculate indicators & signals
    Rails.cache.fetch("indicators/#{coin.slug}:data", expires_in: cache_expiry) do
      calculations = CalculateIndicatorsAndSignals.call(coin)
      calculations.result
    end
  end

  def cache_expiry
    seconds_to_next_day + 1800
  end
end