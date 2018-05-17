class NewsItem < ApplicationRecord
  belongs_to :feed_source
  has_one :news_item_raw
  has_many :mentions
  has_many :coins, through: :mentions

  def coin_symbols
    coins.pluck(:symbol).join(', ')
  end
end
