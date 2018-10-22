class NewsItemCategorization < ApplicationRecord
  belongs_to :news_item
  belongs_to :news_category

  scope :no_category, -> { where(news_category_id: nil)}

  validates_uniqueness_of :news_category, :scope => :news_item
end
