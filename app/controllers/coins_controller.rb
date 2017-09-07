class CoinsController < ApplicationController
  def index
    @coins = Coin.order(:ranking).page(params[:page])
  end

  def show
    @coin = Coin.find(params[:id])
    # TODO: Cache results
    response = HTTParty.get("https://api.coinmarketcap.com/v1/ticker/#{@coin.slug}/")
    @data = JSON.parse(response.body)
    @data = @data[0]
  end
end
