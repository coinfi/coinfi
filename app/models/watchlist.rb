class Watchlist < ApplicationRecord
  belongs_to :user, inverse_of: :watchlist
  has_many :items, class_name: 'WatchlistItem'
  has_many :coins, through: :items
end