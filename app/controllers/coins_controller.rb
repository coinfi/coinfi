class CoinsController < ApplicationController

  COINS_PER_PAGE = 100

  def index
    @coins = Coin.listed.legit.order(:ranking)
    @result_count_total = @coins.length

    @coins = @coins.page(params[:page]).per(COINS_PER_PAGE)
    @result_count = @coins.length

    set_meta_tags(
      title: "Top Cryptocurrency Prices Live, Cryptocurrency Market Cap, Best Cryptocurrency Charts",
      keywords: "cryptocurrency, cryptocurrency news, cryptocurrency market, cryptocurrency prices, cryptocurrency charts, top cryptocurrency, best cryptocurrency"
    )
  end

  def show
    @coin = Coin.find(params[:id])
    @data = @coin.market_info
    @coin_price = @data["price_usd"] # TODO: Consolidate price and volume from data warehouse and remove from coins table.
    @latest_news = @coin.articles.latest_news
    @upcoming_events = @coin.articles.upcoming_events

    if @coin.ico_status == 'listed'
      set_meta_tags(
        title: "#{@coin.symbol} ($#{@coin_price}) - #{@coin.name} Price Chart, Value, News, Market Cap",
        keywords: "#{@coin.name} price, #{@coin.name} chart, #{@coin.name} news, #{@coin.name} market cap, #{@coin.name} reddit, #{@coin.name} price prediction"
      )
    else
      set_meta_tags(
        title: "#{@coin.name} ICO Review, #{@coin.name} Reviews, #{@coin.name} Coin",
        keywords: ''
      )
      render 'icos/show'
    end
  end

end
