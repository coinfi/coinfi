class Coin < ApplicationRecord
  attr_accessor :current_user

  include ICO
  include CoinsHelper
  include ActionView::Helpers::NumberHelper
  extend FriendlyId
  friendly_id :name, use: [:slugged, :finders]

  ICO_STATUSES = %w(upcoming active ended listed).freeze

  has_many :articles
  has_many :coin_excluded_countries
  has_many :coin_industries_coins
  has_many :coin_industries, through: :coin_industries_coins
  has_many :exchange_listings, foreign_key: 'quote_symbol_id'
  has_many :excluded_countries, through: :coin_excluded_countries, source: :country
  has_many :feed_sources
  has_many :influencer_reviews
  has_many :mentions, class_name: 'NewsCoinMention'
  has_many :machine_tagged_mentions, -> { NewsCoinMention.machine_tagged }, class_name: 'NewsCoinMention'
  has_many :human_tagged_mentions, -> { NewsCoinMention.human_tagged }, class_name: 'NewsCoinMention'
  has_many :news_items, through: :mentions
  has_many :machine_tagged_news_items, through: :machine_tagged_mentions, source: :news_item
  has_many :human_tagged_news_items, through: :human_tagged_mentions, source: :news_item

  has_many :calendar_event_coins
  has_many :calendar_events, through: :calendar_event_coins

  validates :name, uniqueness: true, presence: true

  accepts_nested_attributes_for :coin_excluded_countries, allow_destroy: true, reject_if: :all_blank
  accepts_nested_attributes_for :influencer_reviews, allow_destroy: true, reject_if: :all_blank

  before_save :update_previous_name

  scope :legit, -> { where.not(price: nil, image_url: nil) }
  scope :top, -> (limit) { order(ranking: :asc).limit(limit) }
  scope :quick_top, -> (limit) { where("coins.ranking >= ?", limit) }
  scope :icos, -> { where(ico_status: ICO_STATUSES).order(:ico_end_date) }
  scope :unslugged, -> { where(slug: nil) }

  alias_method :industries, :coin_industries

  ICO_STATUSES.each do |status|
    scope status, -> { where(ico_status: status) }
    define_method "ico_#{status}?" do
      ico_status == status
    end
  end

  def self.token_types
    pluck(:token_type).uniq.compact.reject { |t| t.length < 1 }
  end

  def self.symbols
    # Reject any symbols that are nil or not all uppercase.
    pluck(:symbol).uniq.compact.sort.reject { |symbol| /[[:lower:]]/.match(symbol) }
  end

  def most_common_news_category
    NewsCategory
      .joins(news_items: :news_coin_mentions)
      .where(news_coin_mentions: { coin_id: self })
      .group(:id)
      .order('COUNT(DISTINCT news_items.id) DESC')
      .limit(1)
      .first
  end

  def most_common_feed_source
    FeedSource
      .joins(news_items: :news_coin_mentions)
      .where(news_coin_mentions: { coin_id: self })
      .group(:id)
      .order('COUNT(DISTINCT news_items.id) DESC')
      .limit(1)
      .first
  end

  def summary
    result = [];

    if self.ranking && self.market_info["market_cap_usd"]
      result << %W[
        #{self.name} (#{self.symbol}) is currently the ##{self.ranking} cryptocurrency by market cap
        at #{(self.market_info["market_cap_usd"])} USD.
      ]
    end

    if self.market_info["24h_volume_usd"]
      result << %W[
        Trading volume for #{self.name} over the last 24 hours is
        #{(self.market_info["24h_volume_usd"])} USD.
      ]
    end

    recent_news_count = self.news_items.where('feed_item_published_at >= ?', 7.days.ago).count
    formatted_recent_news_count = recent_news_count == 0 ? 'no' : recent_news_count
    if recent_news_count > 1
      result << %W[
        There have been #{recent_news_count} news stories on #{self.name} over the last 7 days.
      ]
    elsif recent_news_count == 1
      result << %W[
        There has been 1 news story on #{self.name} over the last 7 days.
      ]
    else
      result << %W[
        There have been no news stories on #{self.name} over the last 7 days.
      ]
    end

    most_common_feed_source_name = self.most_common_feed_source&.name
    most_common_news_category_name = self.most_common_news_category&.name
    if most_common_feed_source_name && most_common_news_category_name
      result << %W[
        The most common news source covering #{self.name} is #{most_common_feed_source_name} and the
        most common news category is #{most_common_news_category_name}.
      ]
    end

    # Merge the result into a single line string
    result.flatten.join(' ')
  end

  def related_coins
    Coins::RelatedToQuery.call(coin: self)
  end

  def update_previous_name
    self.previous_name = name_was if name_changed?
  end

  def price
    cached_market_data.dig("price") || 0
  end

  def market_cap
    cached_market_data.dig("market_cap") || 0
  end

  def change1h
    cached_market_data.dig("change1h") || 0
  end

  def change24h
    cached_market_data.dig("change24h") || 0
  end

  def change7d
    cached_market_data.dig("change7d") || 0
  end

  def volume24
    cached_market_data.dig("volume24h") || 0
  end

  def available_supply
    cached_market_data.dig("available_supply") || 0
  end

  def max_supply
    cached_market_data.dig("max_supply") || 0
  end

  def total_supply
    cached_market_data.dig("total_supply") || 0
  end

  def cached_market_data
    @snap_data ||= Rails.cache.read("#{slug}:snapshot") || {}
    @snap_data.with_indifferent_access
  end

  def market_info(market_data = nil)
    data = market_data || cached_market_data.dup
    data["24h_volume_usd"] = humanize(data["volume24h"], '$') if data["volume24h"]
    data["market_cap_usd"] = humanize(data["market_cap"], '$') if data["market_cap"]
    data["price_usd"] = data["price"] if data["price"]
    data["total_supply"] = humanize(data["total_supply"]) if data["total_supply"]
    data["max_supply"] = humanize(data["max_supply"]) if data["max_supply"]
    data["available_supply"] = humanize(data["available_supply"]) if data["available_supply"]
    data
  end

  def token_metrics
    {
      exchange_supply_data: exchange_supply_data,
      exchange_supply_metadata: exchange_supply_metadata,
      token_retention_rate_data: token_retention_rate_data,
      token_retention_rate_metadata: token_retention_rate_metadata,
      unique_wallet_count_data: unique_wallet_count_data,
      unique_wallet_count_metadata: unique_wallet_count_metadata,
      token_distribution_100_data: token_distribution_100_data,
      token_distribution_100_metadata: token_distribution_100_metadata,
      token_velocity_data: token_velocity_data,
      token_velocity_metadata: token_velocity_metadata
    }
  end

  def hourly_prices_data
    # TODO: expires_in should probably be at midnight
    Rails.cache.fetch("coins/#{id}/hourly_prices", expires_in: 1.hour) do
      url = "#{ENV.fetch('COINFI_POSTGREST_URL')}/hourly_ohcl_prices?coin_key=eq.#{coin_key}&to_currency=eq.USD&order=time.asc"
      response = HTTParty.get(url)
      JSON.parse(response.body)
    end
  end

  def prices_data
    # TODO: expires_in should probably be at midnight
    Rails.cache.fetch("coins/#{id}/prices", expires_in: 1.day) do
      url = "#{ENV.fetch('COINFI_POSTGREST_URL')}/daily_ohcl_prices?coin_key=eq.#{coin_key}&to_currency=eq.USD&order=time.asc"
      response = HTTParty.get(url)
      JSON.parse(response.body)
    end
  end

  def sparkline
    Rails.cache.fetch("coins/#{id}/sparkline", expires_in: 1.day) do
      url = "#{ENV.fetch('COINFI_POSTGREST_URL')}/daily_ohcl_prices?coin_key=eq.#{coin_key}&select=close&to_currency=eq.USD&limit=7&order=time.desc"
      response = HTTParty.get(url)
      results = JSON.parse(response.body)
      results.map! { |result| result["close"] }
    end
  end

  def token_metrics_data(metric_type)
    return nil unless has_token_metrics?

    @token_metrics_data ||= {}
    @token_metrics_data[metric_type] ||= Rails.cache.fetch(
      "coins/#{id}/#{metric_type}",
      expires_in: 1.day,
      race_condition_ttl: 10.seconds
    ) do
      url = "#{ENV.fetch('COINFI_POSTGREST_URL')}/metrics_chart_view?coin_key=eq.#{coin_key}&metric_type=eq.#{metric_type}&select=percentage,date"
      response = HTTParty.get(url)
      JSON.parse(response.body)
    end
  end

  def token_metrics_metadata(metric_type)
    return nil unless has_token_metrics?

    @token_metrics_metadata ||= {}
    @token_metrics_metadata[metric_type] ||= Rails.cache.fetch(
      "coins/#{id}/#{metric_type}_metadata",
      expires_in: 1.day,
      race_condition_ttl: 10.seconds
    ) do
      url = "#{ENV.fetch('COINFI_POSTGREST_URL')}/#{metric_type}_metrics_view?coin_key=eq.#{coin_key}"
      headers = { "Accept": "application/vnd.pgrst.object+json" } # fetch single object rather than array of objects
      response = HTTParty.get(url, headers: headers)
      results = JSON.parse(response.body)
      results.except!("coin_key")
    end
  end

  def exchange_supply_data
    token_metrics_data('exchange_supply')
  end

  def exchange_supply_metadata
    token_metrics_metadata('exchange_supply')
  end

  def token_retention_rate_data
    token_metrics_data('token_retention_rate')
  end

  def token_retention_rate_metadata
    token_metrics_metadata('token_retention_rate')
  end

  def unique_wallet_count_data
    token_metrics_data('unique_wallet_count')
  end

  def unique_wallet_count_metadata
    token_metrics_metadata('unique_wallet_count')
  end

  def token_distribution_100_data
    token_metrics_data('token_distribution_100')
  end

  def token_distribution_100_metadata
    token_metrics_metadata('token_distribution_100')
  end

  def token_velocity_data
    token_metrics_data('token_velocity')
  end

  def token_velocity_metadata
    token_metrics_metadata('token_velocity')
  end

  def news_data
    # TODO: Reduce cache time from 1 day to 1 hour once hourly price data comes in.
    Rails.cache.fetch("coins/#{id}/news_data", expires_in: 1.day) do
      chart_data = news_items.chart_data(self.name == "Bitcoin" || self.name == "Ethereum")
      i = chart_data.length + 1
      chart_data.map do |item|
        i -= 1
        {
          x: item.published_epoch,
          title: i,
          text: item.title,
          url: item.url
        }
      end
    end
  end

  def listings_data
    i = exchange_listings.length + 1
    exchange_listings.order_by_detected.map do |listing|
      i -= 1
      {
        x: listing.detected_at,
        title: i,
        text: listing.headline,
        url: listing.exchange.www_url
      }
    end
  end

  def is_being_watched
    # Only use this for serialization
    current_user && current_user.coins.include?(self)
  end

  def is_signals_supported_erc20?
    self.eth_address.present?
  end

  def is_erc20?
    re = /(\b(ETH|ETHER|ER[A-Z]?\d*|EIP\d*)\b)|(ETHEREUM)/i
    (
      self.eth_address ||
      re.match(self.blockchain_tech) ||
      re.match(self.token_type)
    ).present?
  end

  def has_token_metrics?
    symbol && is_erc20?
  end
end
