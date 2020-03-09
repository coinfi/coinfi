class CoinArticle < ApplicationRecord
  extend FriendlyId
  friendly_id :slugify, use: :slugged
  alias_attribute :H1, :title
  belongs_to :coin
  belongs_to :author
  validates :title, presence: true
  before_validation :sanitize_html_content
  paginates_per 100
  max_paginates_per 100

  def get_schema
    schema = {
      "@type": "Article",
      "headline": title,
      "dateCreated": created_at.iso8601,
      "dateModified": updated_at.iso8601,
      "datePublished": created_at.iso8601,
      "author": author.get_schema,
    }
  end

  def related_coins
    coins_with_articles = Coin.includes(:coin_articles).where.not(coin_articles: {coin_id: nil})
    Coins::RelatedToQuery.call(coins_with_articles, coin: self.coin)
  end

  def related_articles
    CoinArticle.where(coin_id: related_coins.pluck(:id)).order(updated_at: :desc).limit(8)
  end

  private

  def sanitize_html_content
    sanitizer = Rails::Html::SafeListSanitizer.new
    self.content = sanitizer.sanitize(content, scrubber: Scrubbers::ArticleScrubber.new)
  end

  def slugify
    "#{coin.name} #{coin.symbol}"
  end
end
