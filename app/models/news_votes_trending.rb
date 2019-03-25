class NewsVotesTrending < ApplicationRecord
  self.table_name = 'news_votes_trending_view'
  self.primary_key = 'id'
  belongs_to :news_item, foreign_key: :id

  scope :order_by_total, -> { order('total DESC') }
  scope :order_by_score, -> { order('score DESC') }

  def readonly?
    true
  end
end