class IndicatorsController < ApplicationController
  before_action :set_coin, only: [:show]

  include IndicatorsHelper
  include ActionView::Helpers::NumberHelper

  INDICATOR_COIN_KEYS = [
    'bitcoin.org',
    'ethereum.org',
    'bitcoincash.org',
    'ripple.com',
    'dash.org',
    'litecoin.com',
    'ethereumclassic.org',
    'cardano.org',
    'iota.org',
    'stellar.org',
    'eos.io',
    'neo.org/neo',
    'z.cash',
    'binance.com'
  ]

  def show
    set_indicator_results
    set_summary_results

    render layout: false
  end

  protected

  def format_price(value, precision: 0)
    number_with_delimiter(number_with_precision(value, precision: precision))
  end
  helper_method :format_price

  def format_percentage(value, precision: 2)
    number_to_percentage(value, precision: precision)
  end
  helper_method :format_percentage

  def has_indicator?(coin_key: @coin.coin_key)
    INDICATOR_COIN_KEYS.include? coin_key
  end

  def set_coin
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      coin_id_or_slug = params[:id_or_slug]

      # Attempt to search assuming the param is a slug
      coin_by_slug = Coin.find_by(slug: coin_id_or_slug)
      if coin_by_slug
        @coin = coin_by_slug
        unless has_indicator?
          render_404
        end
        return
      end

      # If we don't find matches for slug, we can safely assume it is an id
      coin_id = coin_id_or_slug
      coin_by_id = nil
      Rollbar.silenced {
        coin_by_id = Coin.find(coin_id)
      }
      if !coin_by_id || !has_indicator?(coin_key: coin_by_id.coin_key)
        render_404
      end

      # 301 redirect to the same action with the coin slug for SEO purposes
      redirect_to action: action_name, id_or_slug: coin_by_id.slug, status: :moved_permanently
    end
  end

  private

  def set_indicator_results
    @daily_price_data = @coin.daily_prices_data
      .map{ |d| { adj_close: d['close'] || 0, high: d['high'] || 0, low: d['low'] || 0 } }
      .last(200) # limit dataset for easier processing
    @indicators = get_indicator_values(@daily_price_data)
    @signals = get_indicator_signals(@indicators)

    @indicator_rows = [
      {
        symbol: :rsi,
        value: @indicators[:rsi],
        min: 0,
        max: 100,
        signal: @signals[:rsi],
      },
      {
        symbol: :stochrsi,
        value: @indicators[:stochrsi],
        min: 0,
        max: 100,
        signal: @signals[:stochrsi],
      },
      {
        symbol: :macd,
        value: @indicators[:macd],
        min: nil,
        max: nil,
        signal: @signals[:macd],
      },
      {
        symbol: :cci,
        value: @indicators[:cci],
        min: nil,
        max: nil,
        signal: @signals[:cci],
      },
      {
        symbol: :stochastic_fast,
        value: @indicators[:stochastic_fast],
        min: 0,
        max: 100,
        signal: @signals[:stochastic_fast],
      },
      {
        symbol: :stochastic_slow,
        value: @indicators[:stochastic_slow],
        min: 0,
        max: 100,
        signal: @signals[:stochastic_slow],
      },
      {
        symbol: :sma,
        value: @indicators[:sma],
        min: nil,
        max: nil,
        signal: @signals[:sma],
      },
      {
        symbol: :ema,
        value: @indicators[:ema],
        min: nil,
        max: nil,
        signal: @signals[:ema],
      }
    ]
  end

  def set_summary_results
    # Summary results are dependent on indicator results
    if @indicator_rows.blank?
      set_indicator_results
    end

    @summary = @indicator_rows.inject({buy: 0, neutral: 0, sell: 0}) do |sum, indicator|
      case indicator[:signal]
      when "BUY"
        sum.update(buy: sum[:buy] + 1)
      when "SELL"
        sum.update(sell: sum[:sell] + 1)
      when "NEUTRAL"
        sum.update(neutral: sum[:neutral] + 1)
      else
        sum
      end
    end

    @summary_value = get_summary_value(@summary)
    @last_updated = Date.parse(@coin.prices_data.last['time'])
  end

  def get_summary_value(summary_signals, strong_threshold: 0.5, weak_threshold: 0.1, neutral_weight: 0.5)
    total = summary_signals.inject(0.0) do |sum, (k, v)|
      if k == :neutral
        sum + v * neutral_weight
      else
        sum + v
      end
    end
    raw_value = summary_signals[:sell] * -1 + summary_signals[:buy] * 1
    percent_value = raw_value / total

    if percent_value <= -1 * strong_threshold
      10 # strong sell
    elsif percent_value > -1 * strong_threshold && percent_value < -1 * weak_threshold
      30 # sell
    elsif percent_value > weak_threshold && percent_value < strong_threshold
      70 # buy
    elsif percent_value >= strong_threshold
      90 # strong buy
    else
      50 # neutral
    end
  end
end
