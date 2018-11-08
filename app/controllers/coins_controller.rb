class CoinsController < ApplicationController
  before_action :set_coin, only: [:show]

  def index
    @page = if params.has_key?(:page) then params[:page].to_i else 1 end
    @limit = if params.has_key?(:limit) then params[:limit].to_i else 100 end

    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      coins = Coin.default
      @coin_count = coins.count
      @coins = serialize_coins(
        coins
          .page(@page)
          .per(@limit)
          .order(:ranking)
      )
    end

    set_meta_tags(
      title: "Top Cryptocurrency Prices Live, Cryptocurrency Market Cap, Best Cryptocurrency Charts",
      keywords: "cryptocurrency, cryptocurrency news, cryptocurrency market, cryptocurrency prices, cryptocurrency charts, top cryptocurrency, best cryptocurrency"
    )
  end

  def show
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      @data = @coin.market_info
      @coin_price = @data["price_usd"] # TODO: Consolidate price and volume from data warehouse and remove from coins table.
      @related_coins = @coin.related_coins.select(:id, :coin_key, :name, :symbol, :slug).to_a # Calling `to_a` ensures query executes on replica.
    end

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

    # TODO: Flag if a non-listed coin gets routed to this controller.
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

  def set_coin
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      coin_id_or_slug = params[:id_or_slug]

      # Attempt to search assuming the param is a slug
      coin_by_slug = Coin.find_by(slug: coin_id_or_slug)
      if coin_by_slug
        @coin = coin_by_slug
        return
      end

      # If we don't find matches for slug, we can safely assume it is an id
      coin_id = coin_id_or_slug
      coin_by_id = nil
      Rollbar.silenced {
        coin_by_id = Coin.find(coin_id)
      }
      if !coin_by_id
        render_404
      end

      # 301 redirect to the same action with the coin slug for SEO purposes
      redirect_to action: action_name, id_or_slug: coin_by_id.slug, status: :moved_permanently
    end
  end

  def serialize_coins(coins)
    coins.as_json(
      only: %i[id name symbol slug coin_key ranking image_url price market_cap change1h change24h change7d volume24],
      methods: %i[sparkline]
    )
  end
end
