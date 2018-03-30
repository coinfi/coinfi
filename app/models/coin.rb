class Coin < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: [:slugged, :finders]

  has_many :articles
  has_many :daily_prices
  has_many :hourly_prices

  has_many :influencer_reviews
  has_many :coin_excluded_countries
  has_many :excluded_countries, through: :coin_excluded_countries

  validates :name, uniqueness: true

  scope :find_by_symbol, -> (symbol) { where('lower(symbol) = ?', symbol.downcase).first }
  scope :top, -> (limit) { order(ranking: :asc).limit(limit) }
end
