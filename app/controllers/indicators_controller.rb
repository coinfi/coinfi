class IndicatorsController < ApplicationController
  before_action :set_coin, only: [:show]

  include IndicatorsHelper
  include ActionView::Helpers::NumberHelper

  def show
    @last_updated = Date.parse(@coin.prices_data.last['time'])
    @daily_price_data = @coin.prices_data.map{ |d| { adj_close: d['close'] || 0, high: d['high'] || 0, low: d['low'] || 0 } }.last(200)
    @indicators = {
      rsi: rsi(@daily_price_data).round(0),
      stochrsi: stochastic_rsi(@daily_price_data).round(0),
      macd: macd(@daily_price_data).round(0),
      cci: cci(@daily_price_data).round(0),
      stochastic_fast: stochastic_fast(@daily_price_data).round(0),
      stochastic_slow: stochastic_slow(@daily_price_data).round(0),
      sma: (simple_moving_average(@daily_price_data, 20) - simple_moving_average(@daily_price_data, 50)).round(0),
      ema: (exponential_moving_average(@daily_price_data, 10) - exponential_moving_average(@daily_price_data, 20)).round(0)
    }
    @signals = {
      rsi: rsi_signal(@indicators[:rsi]),
      stochrsi: stochrsi_signal(@indicators[:stochrsi]),
      macd: macd_signal(@indicators[:macd]),
      cci: cci_signal(@indicators[:cci]),
      stochastic_fast: stochastic_fast_signal(@indicators[:stochastic_fast]),
      stochastic_slow: stochastic_slow_signal(@indicators[:stochastic_slow]),
      sma: simple_moving_average_signal(@indicators[:sma]),
      ema: exponential_moving_average_signal(@indicators[:ema])
    }

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

    @summary = @indicator_rows.inject({buy: 0, neutral: 0, sell: 0}) do |sum, indicator|
      case indicator[:signal]
      when "BUY"
        sum.update(buy: sum[:buy] + 1)
      when "SELL"
        sum.update(sell: sum[:sell] + 1)
      when "NEUTRAL"
        sum.update(neutral: sum[:neutral] + 1)
      end
    end

    # how is this determined?
    @summary_value = 70

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

  def set_coin
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      coin_id_or_slug = params[:id_or_slug]

      # Attempt to search assuming the param is a slug
      coin_by_slug = Coin.find_by(slug: coin_id_or_slug)
      if coin_by_slug
        @coin = coin_by_slug
        return
      end

      # If we don't find matches for slug, we can safely assume it is an id
      coin_id = coin_id_or_slug
      coin_by_id = nil
      Rollbar.silenced {
        coin_by_id = Coin.find(coin_id)
      }
      if !coin_by_id
        render_404
      end

      # 301 redirect to the same action with the coin slug for SEO purposes
      redirect_to action: action_name, id_or_slug: coin_by_id.slug, status: :moved_permanently
    end
  end
end
