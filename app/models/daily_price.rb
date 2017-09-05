class DailyPrice < ApplicationRecord
  belongs_to :coin

  scope :for_currency, -> (currency) {
    order(:date).pluck(
      :timestamp,
      "#{currency}_price".to_sym,
      "#{currency}_volume".to_sym
    )
  }
end
