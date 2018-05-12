class Influencer < ApplicationRecord
  has_many :influencer_reviews
  has_many :coins, through: :influencer_reviews
end
