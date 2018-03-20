class CoinsController < ApplicationController
  def index
    @coins = Coin.order(:ranking).page(params[:page])
  end

  def show
    @coin = Coin.find(params[:id])
    # TODO: Cache results
    response = HTTParty.get("https://api.coinmarketcap.com/v1/ticker/#{@coin.slug}/?convert=BTC")
    @data = JSON.parse(response.body)
    @data = @data[0] || {}
    @data["available_supply"] ||= @coin.available_supply

    @latest_news = @coin.articles.latest_news
    @upcoming_events = @coin.articles.upcoming_events
    respond_to do |format|
      # If we go full React, we can just respond with json, but
      # at the moment we need to render the HTML view as well.
      format.html { render 'coins/show' } 
      format.json { render json: CoinSerializer.new(@coin).serialized_json }
    end
  end

  def historical_data
    @currency = params[:currency] || 'usd'
    coin = Coin.find(params[:id])
    @prices = coin.daily_prices.for_currency(@currency)
    @news = coin.articles.chart_data
  end

end
