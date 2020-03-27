class Api::NewsVoteController < ApiController
  def index
    news_item = NewsItem.find_by_id(params[:news_id])

    if not news_item
      return respond_error 'Could not find news item.'
    end

    respond_success serialize_votes(news_item)
  end

  def create
    if current_user.blank?
      return respond_error 'Must be logged in to vote.'
    end

    if params[:direction].nil?
      return respond_error 'No vote submitted.'
    end

    @news_item = NewsItem.find_by_id(params[:news_id])
    if @news_item.blank?
      return respond_error 'Could not save vote.'
    end

    if current_user.admin?
      weighted_vote_on_news_item(!!params[:direction])
    else
      vote_on_news_item(!!params[:direction])
    end

    respond_success serialize_votes(@news_item)
  end

  private

  def weighted_vote_on_news_item(direction)
    previous_vote = @news_item.get_vote_by_voter_id(current_user.id)

    if previous_vote.nil? # vote as directed
      return @news_item.vote_by(
        voter: current_user,
        vote: direction,
        vote_weight: 1
      )
    end

    previous_direction = previous_vote.vote_flag
    previous_weight = previous_vote.vote_weight

    if previous_direction == direction # increase weight
      return @news_item.vote_by(
        voter: current_user,
        vote: previous_direction,
        vote_weight: previous_weight + 1
      )
    end

    if previous_weight > 1 # decrease weight
      return @news_item.vote_by(
        voter: current_user,
        vote: previous_direction,
        vote_weight: previous_weight - 1
      )
    end

    @news_item.unvote_by current_user
  end

  def vote_on_news_item(direction)
    if current_user.voted_as_when_voted_for(@news_item) == direction
      @news_item.unvote_by current_user
    else
      @news_item.vote_by(voter: current_user, vote: direction)
    end
  end

  def serialize_votes(news_item)
    serialized_votes = news_item.as_json(only: %i[id], methods: %i[vote_score])

    if current_user.present?
      serialized_votes['user_vote'] = current_user.voted_as_when_voted_for(news_item)
    end

    serialized_votes
  end
end
