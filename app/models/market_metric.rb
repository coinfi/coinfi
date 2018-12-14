class MarketMetric < ApplicationRecord
  scope :latest, -> { order(timestamp: desc).first }
end