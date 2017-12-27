class DataController < ApplicationController
  def historical
    @symbol = params[:symbol]
    @currency = params[:currency] || 'usd'

    coin = Coin.select(:id).find_by_symbol(@symbol)
    @prices = coin.daily_prices.for_currency(@currency)
    @news = coin.articles.chart_data
  end

  def delayed_historical
    @symbol = params[:symbol]
    @currency = params[:currency] || 'usd'

    coin = Coin.select(:id).find_by_symbol(@symbol)
    timestamp = (Time.now - 90.days).to_i
    @prices = coin.daily_prices.before(timestamp).for_currency(@currency)
    @news = coin.articles.chart_data

    render 'historical.json.jbuilder'
  end

  def single_historical
    @symbol = params[:symbol]
    currency = params[:currency] || 'usd'

    coin = Coin.select(:id).find_by_symbol(@symbol)
    daily_price = coin.daily_prices.at_timestamp(params[:timestamp].to_i)
    @timestamp = daily_price.timestamp
    @price = daily_price.price[currency]
    @volume = daily_price.volume24[currency]
    render json: {
      timestamp: @timestamp,
      price: @price,
      volume: @volume
    }
  end
end
