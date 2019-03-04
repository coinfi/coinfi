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

    NewsVote.select(<<-SQL
        news_item_id,
        coalesce(sum(vote), 0) as total
      SQL
      )
      .where('vote != 0')
      .group(:news_item_id)
      .having(news_item_id: @news_item_ids)
      .reduce(default_hash) do |hash, item|
        hash[item.news_item_id] = self.vote_summary(
          id: item.news_item_id,
          total: item.total,
        )
        hash
      end
  end

  def self.vote_summary(id: nil, total: 0)
    {
      id: id,
      total: total,
    }
  end

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
    NewsVote.votes_for_news_item(news_item_id: news_item_id)
  end
end