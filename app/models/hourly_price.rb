class HourlyPrice < ApplicationRecord
  belongs_to :coin

  scope :for_currency, -> (currency) {
    order(:timestamp).pluck(
      :timestamp,
      "price -> '#{currency}'",
      "volume24 -> '#{currency}'"
    )
  }
end
