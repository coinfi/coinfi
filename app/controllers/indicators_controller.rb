class IndicatorsController < ApplicationController
  before_action :set_locale
  before_action :set_coin, only: [:show]
  after_action :set_allow_iframe, only: [:show]
  skip_before_action :verify_authenticity_token
  layout false

  include IndicatorsHelper
  include CoinsHelper

  def show
    set_news_items
    set_github_stats

    if Rails.env.production?
      fresh_when last_modified: [@coin.updated_at, @news_items.first.updated_at].max, public: true
    end

    set_indicator_data
    # Update must occur after the date of the last data point
    @last_updated = Date.parse(@coin.prices_data.last['time']) + 1.day
  end

  def render_empty
    set_allow_iframe
    render "indicators/empty"
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
      coin_symbol = params[:ticker]
      coin_symbol.upcase! if coin_symbol.present?

      # Attempt to search assuming the param is a slug
      coin = Coin.find_by(symbol: coin_symbol)
      if coin
        @coin = coin
        return if has_indicator?
      end

      render_empty
    end
  end

  private

  def set_indicator_data
    # Expire cache at the same time as Coin.prices_data, i.e., underlying data used to calculate indicators & signals
    calculations = Rails.cache.fetch("indicators/#{@coin.slug}:data", expires_in: seconds_to_next_day + 1800) do
      calculations = CalculateIndicatorsAndSignals.call(@coin)
      calculations.result
    end

    return if calculations.empty?

    @indicators = calculations[:raw_indicators]
    @signals = calculations[:signals]
    @indicator_rows = calculations[:indicators]
    @summary = calculations[:summary]
    @summary_value = calculations[:summary_value]
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
end
