class ExchangeReviewCategorization < ApplicationRecord
  belongs_to :exchange_review
  belongs_to :exchange_category

  validates :exchange_review, presence: true
  validates :exchange_category, presence: true
end