class NewsCategory < ApplicationRecord
  has_many :news_item_categorizations
  has_many :news_items, through: :news_item_categorizations
end
