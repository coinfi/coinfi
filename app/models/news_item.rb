class NewsItem < ApplicationRecord
  belongs_to :feed_source
  has_one :news_item_raw
end
