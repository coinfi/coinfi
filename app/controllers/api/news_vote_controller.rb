class Api::NewsVoteController < ApiController
  def index
    pp params
    news_vote_summary = NewsVote.votes_for_news_item(news_item_id: params[:news_id])

    if not news_vote_summary
      return respond_error 'Could not find news item.'
    end

    respond_success serialize_vote_summary(news_vote_summary)
  end

  def create
    unless current_user
      respond_error 'Must be logged in to vote.'
    end

    news_vote = NewsVote.cast_vote(current_user, params[:news_id], params[:direction])
    if not news_vote
      return respond_error 'Could not save vote.'
    end

    respond_success serialize_vote_summary(news_vote.vote_summary)
  end

  private

  def serialize_vote_summary(summary)
    summary.as_json
  end
end