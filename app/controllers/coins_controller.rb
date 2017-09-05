class CoinsController < ApplicationController
  def index
    @coins = Coin.all
  end

  def show
    @coin = Coin.find(params[:id])
    response = HTTParty.get("https://api.coinmarketcap.com/v1/ticker/#{@coin.name.downcase}/")
    @data = JSON.parse(response.body)
    @data = @data[0]
  end
end
