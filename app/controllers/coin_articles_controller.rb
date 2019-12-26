class CoinArticlesController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found
  before_action :set_coin_article, only: [:show]

  def index
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      @coin_articles = CoinArticle.page(params[:page]).per(params[:limit])
    end

  end

  def show
    set_meta_tags(
      title: @coin_article.display_title,
      description: @coin_article.meta_description
    )
  end

  private

  def set_coin_article
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      @coin_article = CoinArticle.friendly.find(params[:id])
    end
  end

  def coin_article_params
    params.fetch(:coin_article, {})
  end

  def record_not_found
    render_404
  end
end
