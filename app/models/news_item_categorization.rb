class NewsItemCategorization < ApplicationRecord
  belongs_to :news_item
  belongs_to :news_category
end
