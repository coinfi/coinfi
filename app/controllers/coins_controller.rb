class CoinsController < ApplicationController
  def index
    @coins = Coin.all
  end

  def show
  end
end
