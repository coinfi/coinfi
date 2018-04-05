class Api::Watchlist::ArticlesController < ApiController

  include Api::Watchlist::Concerns

  def index
    @articles = Article.where(coin_id: @watchlist.try(:coin_ids)).order('published_date desc').limit(10)
    respond_success serialized(@articles)
  end

  private

  def serialized obj
    obj.as_json(only: [:id, :title, :summary, :published_date, :url], include: :tags)
  end

end
