class Api::NewsVoteController < ApiController
  def index
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      news_vote_summary = NewsVote.votes_for_news_item(news_item_id: params[:news_id])
      if current_user
        @news_vote = NewsVote.find_by(user: current_user, news_item_id: params[:news_id])
      end

      if not news_vote_summary
        return respond_error 'Could not find news item.'
      end

      respond_success serialize_vote_summary(summary: news_vote_summary, vote: @news_vote)
    end
  end

  def create
    unless current_user
      respond_error 'Must be logged in to vote.'
    end

    news_vote = NewsVote.cast_vote(current_user, params[:news_id], params[:direction])
    if not news_vote
      return respond_error 'Could not save vote.'
    end

    respond_success serialize_vote_summary(news_vote)
  end

  private

  def serialize_vote_summary(news_vote = nil, summary: nil, vote: nil)
    if news_vote.present?
      news_vote.as_json(only: %i[vote], methods: %i[vote_summary])
    elsif summary.present?
      obj = {vote_summary: summary}
      if vote.present?
        obj[:vote] = vote.vote
      end
      obj.as_json
    end
  end
end