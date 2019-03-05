class NewsItemVote < ApplicationRecord
  self.table_name = 'news_item_votes_view'
  self.primary_key = 'news_item_id'
  has_one :news_item, foreign_key: :news_item_id
  alias_attribute :id, :news_item_id

  def readonly?
    true
  end
end