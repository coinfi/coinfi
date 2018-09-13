class NewsItemCategorization < ApplicationRecord
  belongs_to :news_item
  belongs_to :news_category

  validates_uniqueness_of :news_category, :scope => :news_item
end
