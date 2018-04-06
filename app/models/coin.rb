class Coin < ApplicationRecord
  include ICO
  include MarketData
  extend FriendlyId
  friendly_id :name, use: [:slugged, :finders]

  has_many :articles

  has_many :influencer_reviews
  has_many :coin_excluded_countries
  has_many :excluded_countries, through: :coin_excluded_countries, source: :country

  validates :name, uniqueness: true, presence: true

  accepts_nested_attributes_for :coin_excluded_countries, allow_destroy: true, reject_if: :all_blank
  accepts_nested_attributes_for :influencer_reviews, allow_destroy: true, reject_if: :all_blank

  scope :find_by_symbol, -> (symbol) { where('lower(symbol) = ?', symbol.downcase).first }
  scope :top, -> (limit) { order(ranking: :asc).limit(limit) }

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
