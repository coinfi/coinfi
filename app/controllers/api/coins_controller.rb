class Api::CoinsController < ApiController

  def historical_data
    @currency = params[:currency] || 'usd'
    coin = Coin.find(params[:id])
    @prices = coin.daily_prices.for_currency(@currency)
    chart_data = coin.articles.chart_data
    i = chart_data.length + 1
    @news = chart_data.map { |item|
      i -= 1
      {
        x: item.published_epoch,
        title: i,
        text: item.title
      }
    }
    respond_success prices: @prices, news: @news
  end

end
