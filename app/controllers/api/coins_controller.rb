class Api::CoinsController < ApiController
  include ::CoinListHelper
  include ::CoinsHelper

  MAX_PAGE_LIMIT = 100
  DEFAULT_PAGE_LIMIT = 100

  def index
    @current_page = params[:page]&.to_i || 1
    @limit = params[:per]&.to_i || DEFAULT_PAGE_LIMIT
    @limit = MAX_PAGE_LIMIT if @limit > MAX_PAGE_LIMIT

    @coins = Coin.listed.legit.page(@current_page).per(@limit).order(:ranking)
    respond_success coins_serializer(@coins)
  end

  def show
    coin = Coin.find(params[:id])
    if coin.present?
      coin.current_user = current_user
      respond_success show_serializer(coin)
    else
      respond_error "Could not find coin."
    end
  end

  def search
    query = params[:q] || {}
    @coins = Coin.ransack(query).result(distinct: true).limit(params[:limit] || 10).order(:ranking)
    respond_success search_serializer(@coins)
  end

  def prices
    coin = Coin.find(params[:id])
    if coin
      respond_success prices_serializer(coin)
    else
      respond_error "Could not find coin prices."
    end
  end

  def markets
    coin = Coin.find(params[:id])
    if coin
      respond_success markets_serializer(coin)
    else
      respond_error "Could not find coin markets."
    end
  end

  def search_by_params
    coins = []
    tokens_only = params[:tokensOnly].present? && params[:tokensOnly].downcase == 'true'

    if params[:coinSlugs].present?
      coins = Coin.where(slug: params[:coinSlugs])
      coins.erc20_tokens if tokens_only
    elsif params[:name].present?
      token_query = '(coins.blockchain_tech ~* \'(\b(ETH|ETHER|ER[A-Z]?\d*|EIP\d*)\b)|(ETHEREUM)\'
        OR coins.token_type ~* \'(\b(ETH|ETHER|ER[A-Z]?\d*|EIP\d*)\b)|(ETHEREUM)\'
        OR coins.eth_address IS NOT NULL) AND '
      coins = Coin.find_by_sql(["
        SELECT *, CASE
            WHEN UPPER(symbol) = UPPER(:name) THEN 1
            WHEN UPPER(name) = UPPER(:name) THEN 1
            ELSE 3
          END as match
          FROM coins
          WHERE
            #{token_query if tokens_only}
            (UPPER(symbol) LIKE UPPER(:name_prefix)
            OR UPPER(name) LIKE UPPER(:name_prefix))
          ORDER BY match ASC, ranking ASC
          LIMIT 10",
        { name: params[:name], name_prefix: "#{params[:name]}%" }
      ])
    end
    respond_success search_serializer(coins)
  end

  def by_slug
    coin = Coin.find_by(slug: params[:slug])
    if coin.present?
      coin.current_user = current_user
      respond_success show_serializer(coin)
    else
      respond_error "Could not find coin."
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
    coins.as_json(only: %i[id name symbol slug],
      methods: %i[image_url])
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
      # priceDataHourly: coin.hourly_prices_data,
    }
  end

  def markets_serializer(coin)
    return {
      markets: coin.market_pairs,
      total_markets: coin.total_market_pairs,
    }
  end
end
