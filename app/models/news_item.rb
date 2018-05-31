class NewsItem < ApplicationRecord
  belongs_to :feed_source
  has_one :news_item_raw
  has_many :news_coin_mentions
  has_many :coins, through: :news_coin_mentions

  has_many :news_item_categorizations, dependent: :destroy
  has_many :news_categories, through: :news_item_categorizations

  default_scope -> { order(created_at: :desc)}

  def coin_symbols
    coins.pluck(:symbol).join(', ')
  end

  def news_category_names
    news_categories.pluck(:name).join(', ')
  end
end
