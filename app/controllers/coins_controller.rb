class CoinsController < ApplicationController
  def index
    @coins = Coin.order(:ranking).page(params[:page])
  end

  def show
    @coin = Coin.find(params[:id])
    # TODO: Cache results
    response = HTTParty.get("https://api.coinmarketcap.com/v1/ticker/#{@coin.slug}/?convert=BTC")
    @data = JSON.parse(response.body)
    @data = @data[0]

    @latest_news = @coin.articles.latest_news
    @upcoming_events = @coin.articles.upcoming_events
  end
end
