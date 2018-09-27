class CoinsController < ApplicationController
  def index
    @coin_count = Coin.legit.listed.count
    @coins = serialize_coins(
      Coin
        .legit
        .page(1)
        .per(100)
        .order(:ranking)
    )

    set_meta_tags(
      title: "Top Cryptocurrency Prices Live, Cryptocurrency Market Cap, Best Cryptocurrency Charts",
      keywords: "cryptocurrency, cryptocurrency news, cryptocurrency market, cryptocurrency prices, cryptocurrency charts, top cryptocurrency, best cryptocurrency"
    )
  end

  def show
    @coin = Coin.find(params[:id])
    @data = @coin.market_info
    @coin_price = @data["price_usd"] # TODO: Consolidate price and volume from data warehouse and remove from coins table.
    @latest_news = @coin.articles.latest_news
    @upcoming_events = @coin.articles.upcoming_events

    if @coin.symbol && @coin.is_erc20? && ENV['METABASE_SECRET_KEY']
      payload = {
        resource: { dashboard: 3 },
        params: {
          "coin_key" => @coin.coin_key
        }
      }
      token = JWT.encode payload, ENV['METABASE_SECRET_KEY']

      @metabase_url = "https://metabase.coinfi.com/embed/dashboard/#{token}#bordered=false&titled=false"
    else
      @metabase_url = nil
    end

    if @coin.ico_status == 'listed'
      set_meta_tags(
        title: "#{@coin.symbol} ($#{@coin_price}) - #{@coin.name} Price Chart, Value, News, Market Cap",
        keywords: "#{@coin.name} price, #{@coin.name} chart, #{@coin.name} news, #{@coin.name} market cap, #{@coin.name} reddit, #{@coin.name} price prediction"
      )
    else
      set_meta_tags(
        title: "#{@coin.name} ICO Review, #{@coin.name} Reviews, #{@coin.name} Coin",
        keywords: ''
      )
      render 'icos/show'
    end
  end

  protected

  def serialize_coins(coins)
    coins.as_json(
      only: %i[id name symbol slug coin_key ranking image_url price market_cap change1h change24h change7d volume24],
      methods: %i[sparkline]
    )
  end
end
