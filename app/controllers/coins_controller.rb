class CoinsController < ApplicationController

  def index
    @coins = Coin.order(:ranking).page(params[:page])
  end

  def show
    @coin = Coin.find(params[:id])
    @data = @coin.market_info
    @latest_news = @coin.articles.latest_news
    @upcoming_events = @coin.articles.upcoming_events
  end

end
