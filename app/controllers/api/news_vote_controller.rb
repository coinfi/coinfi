class Api::NewsVoteController < ApiController
  def index
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      news_item = NewsItem.find_by_id(params[:news_id])

      if not news_item
        return respond_error 'Could not find news item.'
      end

      respond_success serialize_votes(news_item)
    end
  end

  def create
    if current_user.blank?
      return respond_error 'Must be logged in to vote.'
    end

    if params[:direction].nil?
      return respond_error 'No vote submitted.'
    end

    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      news_item = NewsItem.find_by_id(params[:news_id])
      if news_item.blank?
        return respond_error 'Could not save vote.'
      end

      if current_user.admin?
        if current_user.voted_for?(news_item)
          previous_vote = news_item.votes_for.where(voter_id: current_user.id).first
          same_vote = previous_vote.vote_flag == params[:direction]
          vote = params[:direction]
          vote_weight = same_vote ? previous_vote.vote_weight + 1 : 1
          news_item.vote_by(voter: current_user, vote: vote, vote_weight: vote_weight)
        else
          news_item.vote_by(voter: current_user, vote: params[:direction], vote_weight: 1)
        end
      else
        if params[:direction]
          if current_user.voted_up_on?(news_item)
            news_item.unvote_by current_user
          else
            news_item.upvote_by current_user
          end
        else
          if current_user.voted_down_on?(news_item)
            news_item.unvote_by current_user
          else
            news_item.downvote_by current_user
          end
        end
      end

      respond_success serialize_votes(news_item)
    end
  end

  private

  def serialize_votes(news_item)
    serialized_votes = news_item.as_json(only: %i[id], methods: %i[vote_score])
    pp serialized_votes

    if current_user.present?
      serialized_votes['user_vote'] = current_user.voted_as_when_voted_for(news_item)
    end

    serialized_votes
  end
end
