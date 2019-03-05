class Api::NewsVoteController < ApiController
  include NewsVoteHelper

  def index
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      news_vote_summary = NewsItemVote.find_by(news_item_id: params[:news_id])
      if current_user
        @news_vote = NewsVote.find_by(user: current_user, news_item_id: params[:news_id])
      end

      if not news_vote_summary
        return respond_error 'Could not find news item.'
      end

      respond_success serialize_vote_summary(news_vote_summary, @news_vote)
    end
  end

  def create
    unless current_user
      respond_error 'Must be logged in to vote.'
    end

    news_vote = NewsVote.cast_vote(current_user, params[:news_id], params[:direction], current_user.admin?)
    if not news_vote
      return respond_error 'Could not save vote.'
    end

    respond_success serialize_news_vote(news_vote)
  end

  private
end