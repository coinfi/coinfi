class CoinArticlesController < ApplicationController
  before_action :set_coin_article, only: [:show]

  def index
    @coin_articles = CoinArticle.all
  end

  def show
    @title = @coin_article.meta_title || @coin_article.title

    set_meta_tags(
      title: @title,
      description: @coin_article.meta_description
    )
  end

  private
    def set_coin_article
      @coin_article = CoinArticle.friendly.find(params[:id])
    end

    def coin_article_params
      params.fetch(:coin_article, {})
    end
end
