class CoinArticle < ApplicationRecord
  extend FriendlyId
  friendly_id :slugify, use: :slugged
  belongs_to :coin
  belongs_to :author
  validates :title, presence: true
  paginates_per 100
  max_paginates_per 100

  def display_title
    meta_title || title
  end

  def get_schema
    schema = {
      "@type": "Article",
      "headline": display_title,
      "name": title,
      "dateCreated": created_at.iso8601,
      "dateModified": updated_at.iso8601,
      "author": author.get_schema,
    }
  end

  private

  def slugify
    "how to buy #{coin.name} #{coin.symbol}"
  end
end
