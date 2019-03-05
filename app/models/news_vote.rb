class NewsVote < ApplicationRecord
  upsert_keys [:news_item_id, :user_id]
  belongs_to :news_item
  belongs_to :user

  enum vote: { neutral: 0, up: 1, down: -1 }
  validates :vote, inclusion: { in: votes.keys }

  # RETURNS: record if successful, falsey if failed
  def self.cast_vote(user, news_item_id, vote_direction, multi_vote = false)
    vote = vote_direction.try(:downcase)
    user_id = user.try(:id)
    unless user_id.present? && news_item_id.present? && vote.present?
      return
    end

    begin
      news_vote = self.find_or_create_by(user_id: user_id, news_item_id: news_item_id) do |item|
        item.vote = 'neutral'
      end

      vote = news_vote.process_vote(vote, multi_vote)
      @result = nil
      if multi_vote
        @result = news_vote.update_column(:vote, vote)
      else
        news_vote.vote = vote
        @result = news_vote.save
      end
      @result && news_vote
    rescue ActiveRecord::RecordNotUnique
      retry
    rescue ArgumentError => e
      puts e
      return
    end
  end

  def process_vote(new_vote, multi_vote = false)
    if multi_vote
      case new_vote
      when 'up'
        return (self.vote_before_type_cast || 0) + 1
      when 'down'
        return (self.vote_before_type_cast || 0) - 1
      end
    end

    if vote == new_vote
      return 'neutral'
    else
      return new_vote
    end
  end

  def vote_summary
    NewsItemVote.find_by(news_item_id: news_item_id)
  end
end