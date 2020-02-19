class ExchangeReview < ApplicationRecord
  belongs_to :author
  belongs_to :cmc_exchange
  has_many :exchange_review_categorizations
  has_many :exchange_categorizations, through: :exchange_review_categorizations

  before_validation :create_slug, :on => :create

  validates :author, presence: true
  validates :cmc_exchange, presence: true
  validates :slug, presence: true
  validates :h1, presence: true
  validates :content, presence: true

  private

  def create_slug
    if slug.blank? and cmc_exchange.present?
      self.slug = cmc_exchange.slug
    end
  end
end