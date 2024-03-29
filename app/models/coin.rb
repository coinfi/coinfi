class Coin < ApplicationRecord
  attr_accessor :current_user

  include ICO
  include CoinsHelper
  extend FriendlyId
  friendly_id :name, use: [:slugged, :finders]

  ICO_STATUSES = %w(upcoming active ended listed).freeze

  has_many :articles
  has_many :coin_articles
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
  has_many :metrics, foreign_key: :eth_address
  has_many :calendar_event_coins
  has_many :calendar_events, through: :calendar_event_coins
  has_many :daily_ohcl_prices

  validates :name, presence: true

  accepts_nested_attributes_for :coin_excluded_countries, allow_destroy: true, reject_if: :all_blank
  accepts_nested_attributes_for :influencer_reviews, allow_destroy: true, reject_if: :all_blank

  before_save :update_previous_name

  scope :legit, -> { where.not(image_url: nil) }
  scope :listed, -> { where(is_listed: true) }
  scope :top, -> (limit) { order(ranking: :asc).limit(limit) }
  scope :quick_top, -> (limit) { where("coins.ranking >= ?", limit) }
  scope :icos, -> { where(ico_status: ICO_STATUSES).order(:ico_end_date) }
  scope :unslugged, -> { where(slug: nil) }
  scope :with_git_repo, -> { where.not(git_repo: nil).where.not(git_repo_type: nil) }

  alias_method :industries, :coin_industries

  ICO_STATUSES.each do |status|
    scope "ico_#{status}", -> { where(ico_status: status) }
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

  def self.erc20_tokens
    where("coins.blockchain_tech ~* ?", "(\b(ETH|ETHER|ER[A-Z]?\d*|EIP\d*)\b)|(ETHEREUM)")
      .or(Coin.where("coins.token_type ~* ?", "(\b(ETH|ETHER|ER[A-Z]?\d*|EIP\d*)\b)|(ETHEREUM)"))
      .or(Coin.where.not(eth_address: nil))
  end

  def recent_news_count
    @recent_news_count ||= Rails.cache.fetch("coins/#{id}/recent_news_count", expires_in: seconds_to_next_day) do
      self.news_items.where('feed_item_published_at >= ?', 7.days.ago).count
    end
  end

  def most_common_news_category
    Rails.cache.fetch("coins/#{id}/most_common_news_category", expires_in: seconds_to_next_day) do
      NewsCategory
        .joins(news_items: :news_coin_mentions)
        .where(news_coin_mentions: { coin_id: self })
        .group(:id)
        .order(Arel.sql('COUNT(DISTINCT news_items.id) DESC'))
        .limit(1)
        .first
    end
  end

  def most_common_feed_source
    Rails.cache.fetch("coins/#{id}/most_common_feed_source", expires_in: seconds_to_next_day) do
      FeedSource
        .joins(news_items: :news_coin_mentions)
        .where(news_coin_mentions: { coin_id: self })
        .group(:id)
        .order(Arel.sql('COUNT(DISTINCT news_items.id) DESC'))
        .limit(1)
        .first
    end
  end

  def summary
    result = [];

    if self.ranking && self.market_info["market_cap_usd"]
      result << %W[
        ${linkToCoinNews} (#{self.symbol}) is currently the ##{self.ranking} cryptocurrency by market cap
        at ${currencySymbol}${marketCap} ${currency}.
      ]
    end

    if self.market_info["24h_volume_usd"]
      result << %W[
        Trading volume for #{self.name} over the last 24 hours is
        ${currencySymbol}${volume24h} ${currency}.
      ]
    end

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

  def image_url
    image = read_attribute(:image_url)
    image_re = /s2\.coinmarketcap\.com\/static\/img\/(coins|exchanges)\/[\d]+x[\d]+\/([\d]+)\.png$/i
    result = image_re.match(image || "")

    if result && result.length >= 3
      "/static/#{result[1]}/#{result[2]}.png"
    else
      image
    end
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

  def change30d
    close_price_30d = prices_data.slice(-30)['close']
    (price - close_price_30d) / close_price_30d * 100
  end

  def volume24h
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

  def fixed_supply
    max_supply > 0 ? max_supply : total_supply
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
    data["raw_total_supply"] = data["total_supply"] if data["total_supply"]
    data["raw_max_supply"] = data["max_supply"] if data["max_supply"]
    data["raw_available_supply"] = data["available_supply"] if data["available_supply"]
    data["total_supply"] = humanize(data["total_supply"]) if data["total_supply"]
    data["max_supply"] = humanize(data["max_supply"]) if data["max_supply"]
    data["available_supply"] = humanize(data["available_supply"]) if data["available_supply"]
    data
  end

  # def hourly_prices_data
  #   Rails.cache.fetch("coins/#{id}/hourly_prices", expires_in: seconds_to_next_hour) do
  #     self.touch
  #     url = "#{ENV.fetch('COINFI_POSTGREST_URL')}/hourly_ohcl_prices?coin_key=eq.#{coin_key}&to_currency=eq.USD&order=time.asc"
  #     response = HTTParty.get(url)
  #     JSON.parse(response.body)
  #   end
  # end

  def prices_data(force_refresh: false)
    unless force_refresh
      return @cached_prices_data if @cached_prices_data.present?
    end

    # Expire cache 30 minutes after UTC midnight; new daily data is expected slightly after the midnight-scheduled job
    @cached_prices_data = Rails.cache.fetch("coins/#{id}/prices", expires_in: seconds_to_next_day + 1800, force: force_refresh) do
      self.touch
      daily_ohcl_prices.usd.chronological.map(&:as_json)
    end
  end

  def sparkline
    # Expire cache 30 minutes after UTC midnight; new daily data is expected slightly after the midnight-scheduled job
    Rails.cache.fetch("coins/#{id}/sparkline", expires_in: seconds_to_next_day + 1800) do
      self.touch
      daily_ohcl_prices.usd.reverse_chronological.limit(7).pluck(:close).reverse
    end
  end

  def git_stats(force_refresh: false)
    return unless has_git_repo?
    cache_key = "coins/#{id}/git_stats"

    Rails.cache.fetch(cache_key, force: force_refresh) do
      response = nil
      stats = nil

      if has_github?
        response = CoinServices::RetrieveGithubStats.call(coin: self)
      elsif has_gitlab?
        response = CoinServices::RetrieveGitlabStats.call(coin: self)
      end

      if response.present?
        stats = response.try(:result)
        self.touch
      end

      stats
    end
  end

  def merge_git_stats(stats_to_merge)
    return unless has_git_repo?

    base_stats = git_stats
    merged_stats = base_stats.present? ? base_stats.deep_merge(stats_to_merge) : stats_to_merge

    Rails.cache.write("coins/#{id}/git_stats", merged_stats)
    self.touch
  end

  def has_git_repo?
    git_repo.present? && git_repo_type.present?
  end

  def has_gitlab?
    has_git_repo? && git_repo_type == "gitlab"
  end

  def has_github?
    has_git_repo? && git_repo_type == "github"
  end

  def news_data
    Rails.cache.fetch("coins/#{id}/news_data", expires_in: 1.hour) do
      self.touch
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
end
