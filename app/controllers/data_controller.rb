class DataController < ApplicationController
  def historical
    @symbol = params[:symbol]
    @start_date = params[:start_date] || Date.today - 1.year
    @stop_date = params[:stop_date] || Date.today
    @currency = params[:currency] || 'USD'

    # Query goes here

    # Format DB data into CSV?
    response = HTTParty.get('http://coinmarketcap.northpole.ro/history.json?coin=bitcoin&period=2017&format=array')
    data = JSON.parse(response.body, symbolize_names: true)
    byebug

    #render json:
  end
end
