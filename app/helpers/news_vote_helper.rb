module NewsVoteHelper
  def serialize_news_vote(news_vote)
    news_vote.as_json(only: %i[vote], methods: %i[vote_summary])
  end

  def serialize_vote_summary(news_item_vote, news_vote = nil)
    obj = {
      vote_summary: news_item_vote.as_json(only: %i[id total])
    }
    if news_vote.present?
      obj[:vote] = news_vote.vote
    end
    obj.as_json
  end
end