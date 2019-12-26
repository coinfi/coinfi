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

  private

  def slugify
    "how to buy #{coin.name} #{coin.symbol}"
  end
end
