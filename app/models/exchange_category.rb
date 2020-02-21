class ExchangeCategory < ApplicationRecord
  belongs_to :author
  has_many :exchange_review_categorizations
  has_many :exchange_reviews, through: :exchange_review_categorizations

  before_validation :sanitize_html_content
  validates :name, presence: true
  validates :slug, presence: true

  def get_schema
    schema = {
      "@type": "Article",
      "headline": h1,
      "dateCreated": created_at.iso8601,
      "dateModified": updated_at.iso8601,
      "datePublished": created_at.iso8601,
      "author": author.get_schema,
    }
  end

  private

  def sanitize_html_content
    sanitizer = Rails::Html::SafeListSanitizer.new
    self.content = sanitizer.sanitize(content, scrubber: Scrubbers::ArticleScrubber.new)
  end
end