class DataController < ApplicationController
  def historical
    @symbol = params[:symbol]
    @currency = params[:currency] || 'usd'

    coin = Coin.select(:id).find_by_symbol(@symbol)
    @prices = coin.daily_prices.for_currency(@currency)
    @news = coin.articles.chart_data
  end
end
