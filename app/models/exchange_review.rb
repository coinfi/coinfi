class ExchangeReview < ApplicationRecord
  belongs_to :author
  belongs_to :cmc_exchange
  has_many :exchange_review_categorizations
  has_many :exchange_categories, through: :exchange_review_categorizations

  before_validation :create_slug, :on => :create
  before_validation :sanitize_html_content
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

  scope :ranked, -> { includes(:exchange_review_categorizations).order(Arel.sql('exchange_review_categorizations.ranking, exchange_reviews.updated_at desc')) }

  def get_schema
    schema = {
      "@type": "Review",
      "headline": h1,
      "dateCreated": created_at.iso8601,
      "dateModified": updated_at.iso8601,
      "datePublished": created_at.iso8601,
      "author": author.get_schema,
      "itemReviewed": {
        "@type": "Product",
        "name": cmc_exchange.name,
        "image": cmc_exchange.logo_url,
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": overall_rating,
        "bestRating": highest_rating,
        "worstRating": lowest_rating,
      },
      "reviewBody": meta_description,
    }
  end

  def overall_rating
    (all_ratings.sum / all_ratings.size.to_f).round unless all_ratings.empty?
  end

  def highest_rating
    all_ratings.max unless all_ratings.empty?
  end

  def lowest_rating
    all_ratings.min unless all_ratings.empty?
  end

  def has_quick_facts?
    available_countries.present? || fees.present? || payment_methods.present? || deposit.present? || withdrawal.present?
  end

  private

  def all_ratings
    ratings ||= [fees_rating, ease_of_use_rating, security_rating, support_rating, selection_rating].compact
  end

  def sanitize_html_content
    sanitizer = Rails::Html::SafeListSanitizer.new
    self.content = sanitizer.sanitize(content, scrubber: Scrubbers::ArticleScrubber.new)
  end

  def create_slug
    if slug.blank? and cmc_exchange.present?
      self.slug = cmc_exchange.slug
    end
  end
end