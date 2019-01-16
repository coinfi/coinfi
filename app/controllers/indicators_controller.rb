class IndicatorsController < ApplicationController
  before_action :set_coin, only: [:show]

  include IndicatorsHelper

  def show
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
