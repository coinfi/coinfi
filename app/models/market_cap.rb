class MarketCap < ApplicationRecord
  scope :latest, -> { order(created_at: desc).first } 
end
