class CoinArticlesController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found
  before_action :set_coin_article, only: [:show]
  prepend_before_action :set_amp, only: [:index]
  prepend_before_action :set_amp, only: [:show], if: :select_amp_coin

  breadcrumb 'How to Buy Cryptocurrency', :coin_articles_path, match: :exact

  def index
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      @coin_articles = CoinArticle.page(params[:page]).per(params[:limit])
      @coin_articles.each # force load
    end
  end

  def show
    @related_articles = @coin_article.related_articles

    breadcrumb "#{@coin_article.coin.name} (#{@coin_article.coin.symbol})", coin_article_path(@coin_article)
    set_meta_tags(
      title: @coin_article.meta_title || @coin_article.title,
      description: @coin_article.meta_description
    )
    set_jsonld({
      "@context": "http://schema.org/",
    }.merge(@coin_article.get_schema))
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

  def select_amp_coin
    amp_coins = ['cardano-ada']
    amp_coins.include? params[:id].downcase
  end
end
