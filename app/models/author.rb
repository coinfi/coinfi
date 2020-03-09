class Author < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged
  has_many :coin_articles
  has_many :exchange_reviews
  has_many :exchange_categories
  validates :name, presence: true

  def get_schema
    schema = {
      "@type": "Person",
      "name": name,
    }
    urls = []
    urls << website_url if website_url.present?
    urls << twitter_url if twitter_url.present?
    urls << linkedin_url if linkedin_url.present?
    if urls.size > 1
      schema["sameAs"] = urls
    elsif urls.size == 1
      schema["sameAs"] = urls[0]
    end
    schema["image"] = photo_url if photo_url.present?
    schema
  end
end
