class Watchlist < ApplicationRecord
  belongs_to :user, inverse_of: :watchlist
  has_and_belongs_to_many :coins
end