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

  def self.live_total_market_cap
    coins = Coin.all
    total_market_cap = 0

    coins.each do |coin|
      total_market_cap += coin.market_cap_by_currency('usd') || 0
    end

    total_market_cap
  end

  def self.live_market_dominance(no_cache: false)
    coins = Coin.all
    total_market_cap = Coin.live_total_market_cap
    market_dominance = {}

    coins.each do |coin|
      market_cap = coin.market_cap_by_currency('usd') || 0
      market_dominance[coin.coin_key] = {
        :id => coin.id,
        :name => coin.name,
        :symbol => coin.symbol,
        :slug => coin.slug,
        :price_usd => coin.price_by_currency('usd') || 0,
        :market_percentage => market_cap / total_market_cap
      }
    end

    Rails.cache.write('market_dominance', market_dominance, expires_in: 1.day) unless no_cache

    market_dominance
  end

  def self.market_dominance
    Rails.cache.fetch('market_dominance', expires_in: 1.day) do
      self.live_market_dominance(no_cache: true)
    end
  end

  def self.historical_total_market_data
    Rails.cache.fetch("coins/historical_total_market_data", expires_in: 5.minutes) do
      url = "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/historical"
      query = {
        "count" => 7,
        "interval" => "daily",
      }
      headers = {
        "X-CMC_PRO_API_KEY" => ENV.fetch('COINMARKETCAP_API_KEY')
      }
      response = HTTParty.get(
        url, 
        :query => query,
        :headers => headers,  
      )
      data = JSON.parse(response.body) || {}

      processed_data = (data.dig('data', 'quotes') || []).map { |x| {
        "timestamp" => x['timestamp'],
        "total_market_cap" => x.dig('quote', 'USD', 'total_market_cap'),
        "total_volume_24h" => x.dig('quote', 'USD', 'total_volume_24h'),
      } }

      processed_data
    end
  end

  def market_percentage
    coin = Coin.market_dominance[self.coin_key]
    coin[:market_percentage]
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

  def market_cap_by_currency(currency)
    market_cap.try(:[], currency)
  end

  def volume24_by_currency(currency)
    volume24.try(:[], currency)
  end

  def price_by_currency(currency)
    price.try(:[], currency)
  end

  def live_market_data
    return default_market_data unless ico_listed?
    Rails.cache.fetch("coins/#{id}/market_data", expires_in: 1.minute) do
      url = "https://api.coinmarketcap.com/v1/ticker/#{slug}/?convert=BTC"
      response = HTTParty.get(url)
      data = JSON.parse(response.body)[0] || {}
      default_market_data.merge(data)
    end
  end

  def market_info market_data = nil
    data = market_data || live_market_data.dup
    data["24h_volume_usd"] = humanize(data["24h_volume_usd"], '$') if data["24h_volume_usd"]
    if self.available_supply
      data["available_supply"] = humanize(self.available_supply)
    elsif data["available_supply"]
      data["available_supply"] = humanize(data["available_supply"]) 
    end
    data["market_cap_usd"] = humanize(data["market_cap_usd"], '$') if data["market_cap_usd"]
    data["total_supply"] = humanize(data["total_supply"]) if data["total_supply"]
    data["max_supply"] = humanize(data["max_supply"]) if data["max_supply"]
    data
  end

  def stored_market_info
    market_info({
      "24h_volume_usd": self.volume24_by_currency('usd'),
      "available_supply": display_available_supply(self),
      "market_cap_usd": self.market_cap_by_currency('usd'),
      "price_usd": "$#{self.price_by_currency('usd')}"
    }.stringify_keys)
  end

  def default_market_data
    {'available_supply' => available_supply, 'max_supply' => max_supply}
  end

  def prices_data
    # TODO: expires_in should probably be at midnight
    Rails.cache.fetch("coins/#{id}/prices", expires_in: 1.day) do
      url = "#{ENV.fetch('COINFI_NEW_PRICES_URL')}?coin_key=eq.#{coin_key}&to_currency=eq.USD&order=time.asc"
      response = HTTParty.get(url)
      JSON.parse(response.body)
    end
  end

  def sparkline
    Rails.cache.fetch("coins/#{id}/sparkline", expires_in: 1.day) do
      url = "#{ENV.fetch('COINFI_NEW_PRICES_URL')}?coin_key=eq.#{coin_key}&select=close&to_currency=eq.USD&limit=7&order=time.desc"
      response = HTTParty.get(url)
      results = JSON.parse(response.body)
      results.map! { |result| result["close"] }
    end
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

  def is_erc20?
    return false unless token_type
    token_type.start_with?("ERC") || token_type.start_with?("EIP")
  end
end
