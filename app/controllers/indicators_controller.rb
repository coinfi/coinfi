class IndicatorsController < ApplicationController
  before_action :set_coin, only: [:show]

  include IndicatorsHelper

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
        title: "RSI 14",
        value: @indicators[:rsi],
        min: 0,
        max: 100,
        signal: @signals[:rsi],
        rule: "<30 buy, >70 sell"
      },
      {
        title: "Stochastic RSI 14",
        value: @indicators[:stochrsi],
        min: 0,
        max: 100,
        signal: @signals[:stochrsi],
        rule: "<20 buy, >80 sell"
      },
      {
        title: "MACD (12, 26, 9)",
        value: @indicators[:macd],
        min: nil,
        max: nil,
        signal: @signals[:macd],
        rule: ">0 buy, <0 sell, no netural"
      },
      {
        title: "CCI",
        value: @indicators[:cci],
        min: nil,
        max: nil,
        signal: @signals[:cci],
        rule: "< -100 buy, >100 sell"
      },
      {
        title: "Stochastic fast (14, 3)",
        value: @indicators[:stochastic_fast],
        min: 0,
        max: 100,
        signal: @signals[:stochastic_fast],
        rule: "<20 buy, >80 sell"
      },
      {
        title: "Stochastic (14, 3, 3)",
        value: @indicators[:stochastic_slow],
        min: 0,
        max: 100,
        signal: @signals[:stochastic_slow],
        rule: "<20 buy, >80 sell"
      },
      {
        title: "Moving Averages (20 v 50)",
        value: @indicators[:sma],
        min: nil,
        max: nil,
        signal: @signals[:sma],
        rule: ">0 buy, <0 sell, no netural"
      },
      {
        title: "Exp Moving Averages (10 v 20)",
        value: @indicators[:ema],
        min: nil,
        max: nil,
        signal: @signals[:ema],
        rule: ">0 buy, <0 sell, no netural"
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
