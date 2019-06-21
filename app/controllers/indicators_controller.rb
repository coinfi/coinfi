class IndicatorsController < ApplicationController
  before_action :set_coin, only: [:show]
  after_action :set_allow_iframe, only: [:show]

  skip_before_action :verify_authenticity_token

  include IndicatorsHelper
  include CoinsHelper

  def show
    set_indicators_and_signals
    set_indicator_results
    set_summary_results
    set_news_items
    set_github_stats

    render layout: false
  end

  protected

  def has_indicator?(coin_key: @coin.coin_key)
    INDICATOR_COIN_KEYS.include? coin_key
  end

  def set_allow_iframe
    # Single domain is done using response.set_header('X-Frame-Options', 'allow-from https://example.com')
    response.delete_header('X-Frame-Options') # Allowing all iframe embedding is done by deleting sameorigin policy
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

  def set_indicators_and_signals
    # Expire cache at the same time as Coin.prices_data, i.e., underlying data used to calculat indicators & signals
    @indicators, @signals = Rails.cache.fetch("indicators/#{@coin.slug}", expires_in: seconds_to_next_day + 1800) do
      calculations = CalculateIndicatorsAndSignals.call(@coin)
      calculations.result
    end
  end

  def set_github_stats
    github_stats = @coin.github_stats
    @commit_activity = github_stats[:commit_activity]
    @github_snapshot = github_stats[:snapshot]
  end

  def set_news_items
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      @news_items = NewsItem.published
        .joins(:feed_source)
        .merge(FeedSource.active.not_reddit.not_twitter)
        .joins(:news_coin_mentions)
        .where("news_coin_mentions.id IN (?)", NewsCoinMention.default_tagged.where(coin: @coin).select(:id))
        .order_by_published
        .limit(5)
        .to_a
    end
  end

  def set_indicator_results
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
    # Update must occur after the date of the last data point
    @last_updated = Date.parse(@coin.prices_data.last['time']) + 1.day
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
