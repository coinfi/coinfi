class Coin < ApplicationRecord
  include ICO
  include MarketData
  extend FriendlyId
  friendly_id :name, use: [:slugged, :finders]

  ICO_STATUSES = %w(upcoming active ended listed).freeze

  has_many :articles
  has_many :influencer_reviews
  has_many :coin_excluded_countries
  has_many :excluded_countries, through: :coin_excluded_countries, source: :country
  has_many :coin_industries_coins
  has_many :coin_industries, through: :coin_industries_coins

  validates :name, uniqueness: true, presence: true

  accepts_nested_attributes_for :coin_excluded_countries, allow_destroy: true, reject_if: :all_blank
  accepts_nested_attributes_for :influencer_reviews, allow_destroy: true, reject_if: :all_blank

  before_save :update_previous_name

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
    self.all.pluck(:token_type).uniq.compact.reject { |t| t.length < 1 }
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
end
