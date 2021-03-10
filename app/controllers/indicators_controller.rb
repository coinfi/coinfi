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
    set_git_stats

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
    ticker = params[:ticker]
    return render_empty if ticker.blank?

    coin_symbol = ticker_name_to_symbol(ticker.upcase)
    # Attempt to search assuming the param is a symbol. Use ranking to attempt to pick the correct symbol.
    # Note: If ranking is insufficient, it may be necessary to have a hard-coded mapping
    coin = Coin.order(ranking: :asc).find_by(symbol: coin_symbol)
    if coin
      @coin = coin
      return if has_indicator?
    end

    render_empty
  end

  private

  def set_locale
    if params[:lang].present? && I18n.available_locales.map(&:to_s).include?(params[:lang])
      I18n.locale = params[:lang]
    else
      I18n.locale = I18n.default_locale
    end
  end

  def set_indicator_data
    # Expire cache at the same time as Coin.prices_data, i.e., underlying data used to calculate indicators & signals
    calculations = Rails.cache.fetch("indicators/#{@coin.slug}:data", expires_in: seconds_to_next_day + 1800) do
      calculations = CalculateIndicatorsAndSignals.call(@coin)
      calculations.result
    end

    return if calculations.blank?

    @indicators = calculations[:raw_indicators]
    @signals = calculations[:signals]
    @indicator_rows = calculations[:indicators]
    set_summary(calculations[:summary])
    @summary_value = calculations[:summary_value]
    @summary_consensus = get_consensus_symbol(@summary_value)
  end

  def set_git_stats
    git_stats = @coin.git_stats
    @has_git_stats = git_stats.present?

    return unless @has_git_stats
    @commit_activity = git_stats[:commit_activity]
    @git_snapshot = git_stats[:snapshot]
  end

  def set_news_items
    @news_items = Rails.cache.fetch("indicators/#{@coin.slug}:news_item", expires_in: 5.minutes) do
      NewsItem.published
        .joins(:feed_source)
        .merge(FeedSource.active.not_reddit.not_twitter)
        .joins(:news_coin_mentions)
        .where("news_coin_mentions.coin_id = ?", @coin.id)
        .order_by_published
        .limit(5)
        .to_a
    end
  end

  def set_summary(summary)
    total = (summary[:buy] + summary[:sell] + summary[:neutral]).to_f
    @summary = summary
    if total > 0
      @summary_buy = (summary[:buy] / total * 100).round
      @summary_sell = (summary[:sell] / total * 100).round
      @summary_neutral = 100 - @summary_buy - @summary_sell
    else
      @summary_buy = 0
      @summary_sell = 0
      @summary_neutral = 0
    end
  end
end
