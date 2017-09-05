class Coin < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: [:slugged, :finders]

  has_many :articles
  has_many :daily_prices

  scope :find_by_symbol, -> (symbol) { where('lower(symbol) = ?', symbol.downcase).first }
  scope :find_by_name, -> (name) { where('lower(name) = ?', name.downcase).first }
end
