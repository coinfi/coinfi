class InfluencerReview < ApplicationRecord
  belongs_to :coin, counter_cache: true
  belongs_to :influencer
end
