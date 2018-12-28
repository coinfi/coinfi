class Api::CoinsController < ApiController
  include ::CoinListHelper
  include ::CoinsHelper

  def index
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      @current_page = params[:page] || 1
      @coins = Coin.listed.legit.page(@current_page).per(params[:per]).order(:ranking)
      respond_success coins_serializer(@coins)
    end
  end

  def show
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      coin = Coin.find(params[:id])
      if coin.present?
        coin.current_user = current_user
        respond_success show_serializer(coin)
      else
        respond_error "Could not find coin."
      end
    end
  end

  def search
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      query = params[:q] || {}
      @coins = Coin.ransack(query).result(distinct: true).limit(params[:limit] || 10).order(:ranking)
      respond_success search_serializer(@coins)
    end
  end

  def prices
    coin = Coin.find(params[:id])
    if coin
      respond_success prices_serializer(coin)
    else
      respond_error "Could not find coin prices."
    end
  end

  def search_by_params
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      coins = []
      if params[:coinSlugs].present?
        coins = Coin.where(slug: params[:coinSlugs])
      elsif params[:name].present?
        coins = Coin.find_by_sql(["
          SELECT *, CASE
              WHEN UPPER(symbol) = UPPER(:name) THEN 1
              WHEN UPPER(name) = UPPER(:name) THEN 1
              ELSE 3
            END as match
            FROM coins
            WHERE UPPER(symbol) LIKE UPPER(:name_prefix)
              OR UPPER(name) LIKE UPPER(:name_prefix)
            ORDER BY match ASC, ranking ASC
            LIMIT 10",
            { name: params[:name], name_prefix: "#{params[:name]}%" }
          ])
      end
      respond_success search_serializer(coins)
    end
  end

  def by_slug
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      coin = Coin.find_by(slug: params[:slug])
      if coin.present?
        coin.current_user = current_user
        respond_success show_serializer(coin)
      else
        respond_error "Could not find coin."
      end
    end
  end

  def toplist
    respond_success toplist_coins
  end

  def watchlist
    if current_user
      respond_success watchlist_coins
    else
      render json: {}, status: :unauthorized
    end
  end

  def dominance
    respond_success serialized_dominance
  end

private
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

  def prices_serializer(coin)
    return {
      priceData: coin.prices_data,
      priceDataHourly: coin.hourly_prices_data,
    }
  end
end
