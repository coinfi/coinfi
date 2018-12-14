class CoinsController < ApplicationController
  before_action :set_coin, only: [:show]

  include CoinListHelper

  def index
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      @coin_count = Coin.listed.count
      @coins = index_serializer(
        Coin
          .legit
          .page(1)
          .per(100)
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

      if @coin.ico_status == 'listed'
        @coin_price = @data["price_usd"] # TODO: Consolidate price and volume from data warehouse and remove from coins table.
        @related_coins = @coin.related_coins.select(:id, :coin_key, :name, :symbol, :slug).to_a # Calling `to_a` ensures query executes on replica.
        @token_metrics = @coin.has_token_metrics? ? @coin.token_metrics : {}
        @coin_obj = show_serializer(@coin)
        @top_coins_data = toplist_coins
        @watched_coins_data = watchlist_coins if current_user
      end
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

  def index_serializer(coins)
    coins.as_json(
      only: %i[id name symbol slug coin_key ranking image_url],
      methods: %i[sparkline price market_cap change1h change24h change7d volume24h]
    )
  end

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

  def show_serializer(coin)
    coin.as_json(
      only: %i[
        id name coin_key image_url symbol slug ranking ico_status
        website whitepaper explorer twitter reddit medium github telegram
        release_date blockchain_tech algorithm ico_start_epoch ico_end_epoch
      ],
      methods: %i[
        prices_data news_data market_info is_being_watched summary price market_cap
        change1h change24h change7d volume24h available_supply max_supply total_supply
      ]
    )
  end
end
