class DataController < ApplicationController
  def historical
    @symbol = params[:symbol]
    @start_date = params[:start_date] || Date.today - 1.year
    @stop_date = params[:stop_date] || Date.today
    @currency = params[:currency] || 'usd'

    # Query goes here
    coin = Coin.select(:id).find_by_symbol(@symbol)
    prices = DailyPrice.historical(coin.id, @currency)

    render plain: prices
  end
end
