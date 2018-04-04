class Api::CoinsController < ApiController

  def index
    @q = Coin.ransack(params[:q])
    @coins = @q.result(distinct: true)
    respond_success serialized(@coins)
  end

  def news
    @currency = params[:currency] || 'usd'
    coin = Coin.find(params[:id])
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
    respond_success news: @news
  end

  private

  def serialized coin
    coin.as_json(only: [:id, :name, :image_url, :symbol])
  end

end
