class DailyPrice < ApplicationRecord
  belongs_to :coin

  scope :for_currency, -> (currency) {
    order(:date).pluck(
      :timestamp,
      "price -> '#{currency}'",
      "volume24 -> '#{currency}'"
    )
  }

  scope :before, -> (before_timestamp) {
    where("timestamp < ?", before_timestamp)
  }

  scope :at_timestamp, -> (timestamp) {
    where("timestamp > ?", timestamp).order(timestamp: 'ASC').first
  }
end
