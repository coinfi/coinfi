class Coin < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: [:slugged, :finders]

  has_many :articles
  has_many :daily_prices
  has_many :hourly_prices

  validates :name, uniqueness: true
  validates :symbol, uniqueness: true

  scope :find_by_symbol, -> (symbol) { where('lower(symbol) = ?', symbol.downcase).first }
  scope :top, -> (limit) { order(ranking: :asc).limit(limit) }
end
