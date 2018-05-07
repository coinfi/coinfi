class Api::CoinsController < ApiController

  def index
    if params[:exclude_watched]
      @q = Coin.where.not(id: current_user.watchlist.coin_ids).ransack(params[:q])
    else
      @q = Coin.ransack(params[:q])
    end
    @coins = @q.result(distinct: true).limit(params[:limit] || 10)
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
        text: item.title,
        url: item.url
      }
    }
    respond_success news: @news
  end

  private

  def serialized coin
    coin.as_json(only: [:id, :name, :image_url, :symbol, :slug, :price_usd])
  end

end
