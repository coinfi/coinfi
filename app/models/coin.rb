class Coin < ApplicationRecord
  attr_accessor :current_user

  include ICO
  include CoinsHelper
  include ActionView::Helpers::NumberHelper
  extend FriendlyId
  friendly_id :name, use: [:slugged, :finders]

  ICO_STATUSES = %w(upcoming active ended listed).freeze

  has_many :articles
  has_many :influencer_reviews
  has_many :coin_excluded_countries
  has_many :excluded_countries, through: :coin_excluded_countries, source: :country
  has_many :coin_industries_coins
  has_many :coin_industries, through: :coin_industries_coins
  has_many :feed_sources
  has_many :mentions, class_name: 'NewsCoinMention'
  has_many :news_items, through: :mentions
  has_many :calendar_event_coins
  has_many :calendar_events, through: :calendar_event_coins

  validates :name, uniqueness: true, presence: true

  accepts_nested_attributes_for :coin_excluded_countries, allow_destroy: true, reject_if: :all_blank
  accepts_nested_attributes_for :influencer_reviews, allow_destroy: true, reject_if: :all_blank

  before_save :update_previous_name

  scope :legit, -> { where.not(market_cap: nil).where.not(price: nil).where.not(image_url: nil) }
  scope :top, -> (limit) { order(ranking: :asc).limit(limit) }
  scope :icos, -> { where(ico_status: ICO_STATUSES).order(:ico_end_date) }

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
    data["available_supply"] = humanize(data["available_supply"]) if data["available_supply"]
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

  private

  def default_market_data
    {'available_supply' => available_supply, 'max_supply' => max_supply}
  end

  def prices_data
    # TODO: expires_in should probably be at midnight
    Rails.cache.fetch("coins/#{id}/prices_data", expires_in: 1.day) do
      url = "#{ENV.fetch('COINFI_PRICES_URL')}api/v1/coins/#{symbol}/daily_history.json"
      response = HTTParty.get(url)
      JSON.parse(response.body)
    end
  end

  def sparkline
    Rails.cache.fetch("coins/#{id}/sparkline", expires_in: 1.day) do
      url = "#{ENV.fetch('COINFI_PRICES_URL')}api/v1/coins/#{symbol}/daily_history.json?limit=7"
      response = HTTParty.get(url)
      results = JSON.parse(response.body)
      results.map { |result| result["close"] }
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

  def is_being_watched
    # Only use this for serialization
    current_user && current_user.coins.include?(self)
  end
end
