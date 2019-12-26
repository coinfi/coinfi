class CoinArticle < ApplicationRecord
  extend FriendlyId
  friendly_id :slugify, use: :slugged
  belongs_to :coin
  belongs_to :author
  validates :title, presence: true

  private

  def slugify
    "how to buy #{coin.name} #{coin.symbol}"
  end
end
