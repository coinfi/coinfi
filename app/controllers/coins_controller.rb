class CoinsController < ApplicationController
  def index
    @coins = Coin.all
  end

  def show
    @coin = Coin.find(params[:id])
  end
end
