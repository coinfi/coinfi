class CoinsController < ApplicationController
  def index
    @coins = Coin.order(:ranking).page(params[:page])

    set_meta_tags(
      title: "Top Cryptocurrency Prices Live, Cryptocurrency Market Cap, Best Cryptocurrency Charts",
      keywords: "cryptocurrency, cryptocurrency news, cryptocurrency market, cryptocurrency prices, cryptocurrency charts, top cryptocurrency, best cryptocurrency"
    )
  end

  def icos
    @status = params[:status]
    redirect_to "/icos/upcoming" and return unless Coin::ICO_STATUSES.include?(@status)
    @coins = Coin.where(ico_status: @status).order(:ico_end_date).page(params[:page])

    set_meta_tags(
      keywords: "ico list, ico rating, ico alert, ico review, initial coin offering, initial coin offering list, ico initial coin offering"
    )
  end

  def show
    @coin = Coin.find(params[:id])
    @data = @coin.market_info
    @latest_news = @coin.articles.latest_news
    @upcoming_events = @coin.articles.upcoming_events

    if @coin.ico_status == "listed"
      title = "#{@coin.symbol} ($#{@coin.price["usd"]}) - #{@coin.name} Price Chart, Value, News, Market Cap"
      keywords = "#{@coin.name} price, #{@coin.name} chart, #{@coin.name} news, #{@coin.name} market cap, #{@coin.name} reddit, #{@coin.name} price prediction"
    else
      title = "#{@coin.name} ICO Review, #{@coin.name} Reviews, #{@coin.name} Coin"
      keywords = ""
    end

    set_meta_tags(
      title: title,
      keywords: keywords
    )
  end
end
