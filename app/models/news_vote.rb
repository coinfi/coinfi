class NewsVote < ApplicationRecord
  upsert_keys [:news_item_id, :user_id]
  belongs_to :news_item
  belongs_to :user

  enum vote: { neutral: 0, up: 1, down: -1 }
  validates :vote, inclusion: { in: votes.keys }

  def self.votes_for_news_item(default = nil, news_item: nil, news_item_id: nil)
    news_item ||= default
    if news_item.blank? && news_item_id.blank?
      return
    end

    @news_item_id = news_item.try(:id) || news_item_id
    votes = self.votes_by_news_item(news_item_ids: [@news_item_id])
    votes.dig(@news_item_id) || self.vote_summary(id: @news_item_id)
  end

  def self.votes_by_news_item(default = nil, news_items: nil, news_item_ids: nil)
    news_items ||= default
    if news_items.blank? && news_item_ids.blank?
      return
    end

    @news_item_ids = news_items.try(:map) { |item| item.try(:id) } || news_item_ids
    # create default hash to ensure all ids are present even if no sql result is present
    default_hash = @news_item_ids.reduce({}) { |hash, id| hash.merge(Hash[id, self.vote_summary(id: id)]) }

    NewsVote.select('news_item_id,
                     coalesce(sum(vote), 0) as total,
                     coalesce(count(vote), 0) as count,
                     coalesce(sum(case when vote=1 then 1 else 0 end), 0) as up,
                     coalesce(sum(case when vote=-1 then 1 else 0 end), 0) as down')
      .where('vote != 0')
      .group(:news_item_id)
      .having(news_item_id: @news_item_ids)
      .reduce(default_hash) do |hash, item|
        hash[item.news_item_id] = self.vote_summary(
          id: item.news_item_id,
          total: item.total,
          count: item.count,
          up: item.up,
          down: item.down,
        )
        hash
      end
  end

  def self.vote_summary(id: nil, total: 0, count: 0, up: 0, down: 0)
    {
      id: id,
      total: total,
      count: count,
      up: up,
      down: down,
    }
  end

  # RETURNS: record if successful, falsey if failed
  def self.cast_vote(user, news_item_id, vote_direction)
    vote = vote_direction.try(:downcase)
    user_id = user.try(:id)
    unless user_id.present? && news_item_id.present? && vote.present?
      return
    end

    begin
      news_vote = self.find_or_create_by(user_id: user_id, news_item_id: news_item_id) do |item|
        item.vote = 'neutral'
      end
      news_vote.process_vote(vote)
      news_vote.save && news_vote
    rescue ActiveRecord::RecordNotUnique
      retry
    rescue ArgumentError
      return
    end
  end

  def process_vote(new_vote)
    if vote == new_vote
      self.vote = 'neutral'
    else
      self.vote = new_vote
    end
  end

  def vote_summary
    NewsVote.votes_for_news_item(news_item_id: news_item_id)
  end
end