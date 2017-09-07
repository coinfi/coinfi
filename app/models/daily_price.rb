class DailyPrice < ApplicationRecord
  belongs_to :coin

  scope :for_currency, -> (currency) {
    order(:date).pluck(
      :timestamp,
      "price -> '#{currency}'",
      "volume24 -> '#{currency}'"
    )
  }
end
