class DailyPrice < ApplicationRecord
  belongs_to :coin

  scope :historical, ->(coin_id, currency) {
    where(coin_id: coin_id).order(:date).pluck(
      :timestamp,
      "#{currency}_price".to_sym,
      "#{currency}_volume".to_sym
    )
  }
end
