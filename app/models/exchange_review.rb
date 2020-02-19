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
  validates :fees_rating, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 5 }, allow_nil: true
  validates :ease_of_use_rating, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 5 }, allow_nil: true
  validates :security_rating, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 5 }, allow_nil: true
  validates :support_rating, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 5 }, allow_nil: true
  validates :selection_rating, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 5 }, allow_nil: true

  private

  def create_slug
    if slug.blank? and cmc_exchange.present?
      self.slug = cmc_exchange.slug
    end
  end
end