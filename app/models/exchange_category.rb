class ExchangeCategory < ApplicationRecord
  belongs_to :author
  has_many :exchange_review_categorizations
  has_many :exchange_reviews, through: :exchange_review_categorizations

  validates :name, presence: true
  validates :slug, presence: true
end