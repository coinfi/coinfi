class NewsTweet < ApplicationRecord
  belongs_to :news_item

  def tweet_id
    metadata["id"] if metadata && metadata["id"]
  end
end