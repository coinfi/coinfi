class CoinArticlesController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found
  prepend_before_action :set_amp, only: [:index]
  prepend_before_action :set_amp, only: [:show], if: :select_amp_coin

  breadcrumb 'How to Buy Cryptocurrency', :coin_articles_path, match: :exact

  def index
    @h1 = "How To Buy Cryptocurrency: The Best Way To Buy Crypto In #{Time.current.year}"
    @coin_articles = CoinArticle.page(params[:page]).per(params[:limit])
    @coin_articles.each # force distribute_reads load

    set_meta_tags(
      title: @h1
    )
  end

  def show
    @coin_article = CoinArticle.friendly.find(params[:id])
    @author = @coin_article.author
    @related_articles = @coin_article.related_articles

    breadcrumb "#{@coin_article.coin.name} (#{@coin_article.coin.symbol})", coin_article_path(@coin_article)
    set_meta_tags(
      title: @coin_article.meta_title.presence || @coin_article.title,
      description: @coin_article.meta_description
    )
    set_jsonld(
      {
        "@context": "http://schema.org/",
        "publisher": {
          "@type": "Organization",
          "name": "CoinFi",
          "url": "https://#{ENV.fetch('ROOT_DOMAIN')}",
          "logo": {
            "@type": "ImageObject",
            "url": view_context.image_url('amp-logo.png'),
            "height": "174",
            "width": "60"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url_for(format: :html, only_path: false),
        },
        "image": view_context.image_url('article-splash.jpg'), # default image
      }.merge(@coin_article.get_schema)
    )
  end

  private

  def coin_article_params
    params.fetch(:coin_article, {})
  end

  def select_amp_coin
    amp_coins = ['cardano-ada']
    amp_coins.include? params[:id].downcase
  end
end
