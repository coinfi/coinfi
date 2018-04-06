class WatchlistItem < ApplicationRecord
  belongs_to :watchlist
  belongs_to :coin
  default_scope -> { order(:position) }
end