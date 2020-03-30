class NewsVotesTrending < ApplicationRecord
  self.primary_key = :id
  belongs_to :news_item, foreign_key: :id

  scope :order_by_total, -> { order('total DESC') }
  scope :order_by_score, -> { order('score DESC') }

  def self.refresh
    Scenic.database.refresh_materialized_view(table_name, concurrently: true, cascade: false)
  end

  def readonly?
    true
  end
end