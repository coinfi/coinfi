class Api::CoinsController < ApiController
  def index
    @current_page = params[:page] || 1
    @coins = Coin.default.page(@current_page).per(params[:per]).order(:ranking)

    respond_success index_serializer(@coins)
  end

  def show
    coin = Coin.find(params[:id])
    coin.current_user = current_user
    respond_success show_serializer(coin)
  end

  def search
    query = params[:q] || {}
    @coins = Coin.ransack(query).result(distinct: true).limit(params[:limit] || 10).order(:ranking)
    respond_success search_serializer(@coins)
  end

  def search_by_params
    coins = []
    puts params
    if params[:coinSlugs].present?
      coins = Coin.where(slug: params[:coinSlugs])
    elsif params[:name].present?
      coins = Coin.find_by_sql("
        SELECT *, CASE
            WHEN UPPER(symbol) = UPPER('#{params[:name]}') THEN 1
            WHEN UPPER(name) = UPPER('#{params[:name]}') THEN 1
            ELSE 3
          END as match
          FROM coins
          WHERE UPPER(symbol) LIKE UPPER('#{params[:name]}%')
            OR UPPER(name) LIKE UPPER('#{params[:name]}%')
          ORDER BY match ASC, ranking ASC
          LIMIT 10")
    end
    respond_success search_serializer(coins)
  end

  def by_slug
    coin = Coin.find_by(slug: params[:slug])
    coin.current_user = current_user
    respond_success show_serializer(coin)
  end

  def toplist
    coins = Rails.cache.fetch("coins/toplist", expires_in: 1.hour) do
      distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
        Coin.order(:ranking).limit(20)
      end
    end
    respond_success coinlist_serializer(coins)
  end

  def watchlist
    coins = current_user.watchlist.coins.order(:ranking)
    respond_success coinlist_serializer(coins)
  end

  def dominance
    market_dominance = Coin.market_dominance

    # Bitcoin + top 4
    bitcoin = market_dominance.extract!('bitcoin.org').flat_map { |v| v[1] }
    other_coins = market_dominance.dup
                    .sort_by { |k, v| v[:market_percentage] }
                    .reverse[0..3]
                    .flat_map { |v| v[1] }
    coins = bitcoin + other_coins

    respond_success coins.as_json
  end

private

  def coinlist_serializer(coins)
    coins.as_json(
      only: %i[id name symbol slug price_usd],
      methods: %i[market_info]
    )
  end

  def index_serializer(coins)
    coins.as_json(
      only: %i[id name symbol slug coin_key ranking image_url price market_cap change1h change24h change7d volume24],
      methods: %i[sparkline]
    )
  end

  def search_serializer(coins)
    coins.as_json(only: %i[id name symbol slug image_url])
  end

  def show_serializer(coin)
    related_coins_data = coin.related_coins.as_json(
      only: %i[id coin_key name symbol slug]
    )

    return {
      id: coin.id,
      coin_key: coin.coin_key,
      name: coin.name,
      image_url: coin.image_url,
      symbol: coin.symbol,
      slug: coin.slug,
      prices_data: coin.prices_data,
      news_data: coin.news_data,
      market_info: coin.market_info,
      is_being_watched: coin.is_being_watched,
      related_coins_data: related_coins_data,
      summary: coin.summary,
    }
  end
end
