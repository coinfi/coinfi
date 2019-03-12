class NewsVotesTrending < ApplicationRecord
  self.table_name = 'news_votes_trending_view'
  self.primary_key = 'id'
  belongs_to :news_item

  def readonly?
    true
  end
end