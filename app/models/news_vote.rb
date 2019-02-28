class NewsVote < ApplicationRecord
  belongs_to :news_item
  belongs_to :user
end