class Api::ArticlesController < ApiController

  def index
    @articles = Article.ransack(
      params[:q]
    ).result(distinct: true).order('published_date desc').limit(10)
    respond_success serialized(@articles)
  end

  private

  def serialized(obj)
    obj.as_json(only: %i[id title summary published_date url], include: :tags)
  end

end
