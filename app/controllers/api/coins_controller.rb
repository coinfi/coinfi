class Api::CoinsController < ApiController

  def index
    query = params[:q] || {}
    if params[:exclude_watched]
      query[:id_not_in] = current_user.watchlist.coin_ids
    end
    @coins = Coin.ransack(query).result(distinct: true).limit(params[:limit] || 10)
    respond_success index_serializer(@coins)
  end

  def show
    respond_success show_serializer(Coin.find(params[:id]))
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

  def index_serializer coin
    coin.as_json(only: [:id, :name, :image_url, :symbol, :slug, :price_usd])
  end

  def show_serializer coin
    coin.as_json(only: [:id, :name, :image_url, :symbol, :slug, :price_usd])
  end

end
