class Api::IndicatorsController < ApiController
  before_action :authenticate
  skip_before_action :verify_authenticity_token

  include IndicatorsHelper
  include CoinsHelper

  def tickers
    tickers_json = Rails.cache.fetch("indicators/tickers", expires_in: cache_expiry) do
      coins = Coin.where(coin_key: INDICATOR_COIN_KEYS)
      ticker_serializer(coins)
    end
    render json: tickers_json
  end

  def overview
    tickers = params[:tickers].upcase.split(',') if params[:tickers].present?
    return render json: [] if tickers.blank?

    cache_keys = tickers.uniq.map {|ticker| "indicators/overview/#{ticker}"}
    overview_coins_json = Rails.cache.fetch_multi(*cache_keys, expires_in: cache_expiry) do |cache_key|
      ticker = cache_key.split('/').last
      symbol = ticker_name_to_symbol(ticker)
      coin = Coin.where(symbol: symbol).where(coin_key: INDICATOR_COIN_KEYS).first
      next nil if coin.blank?
      overview_coin_serializer(coin)
    end
    # Use flatmap to transition from old combined cache keys style
    overview_json = cache_keys.flat_map{|key| overview_coins_json[key]}.compact

    render json: overview_json
  end

  private

  def authenticate
    api_key = request.headers['X-APIToken'] || request.headers['X-API-Key']
    return if api_key.present? && api_key == ENV.fetch("INDICATORS_API_KEY")

    render plain: '', status: 401
  end

  def ticker_serializer(coins)
    tickers = coins.map {|coin| symbol_to_ticker_name(coin.symbol)}.compact
    { tickers: tickers }
  end

  def overview_coin_serializer(coin)
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

  def overview_serializer(coins)
    coins.map do |coin|
      overview_coin_serializer(coin)
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