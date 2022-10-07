class CoinsController < ApplicationController
  before_action :set_coin, only: [:show]

  include CoinListHelper
  include CoinsHelper
  include CurrencyHelper

  before_action :set_exchange_rates

  MAX_PAGE_LIMIT = 100
  DEFAULT_PAGE_LIMIT = 100

  def index
    @page = params[:page]&.to_i || 1
    @limit = params[:limit]&.to_i || DEFAULT_PAGE_LIMIT
    @limit = MAX_PAGE_LIMIT if @limit > MAX_PAGE_LIMIT

    coins = Coin.listed.legit
    @coin_count = coins.count
    @coins = coins_serializer(
      coins
        .page(@page)
        .per(@limit)
        .order(:ranking)
    )

    set_meta_tags(
      title: "Top Cryptocurrency Prices Live, Cryptocurrency Market Cap, Best Cryptocurrency Charts",
      keywords: "cryptocurrency, cryptocurrency news, cryptocurrency market, cryptocurrency prices, cryptocurrency charts, top cryptocurrency, best cryptocurrency"
    )
  end

  def show
    # Leave ICO logic intact incase we relist them
    unless @coin.ico_listed?
      render_404
    end

    if @coin.ico_listed?
      @coin_price = format_price(@coin.price)
      @related_coins = @coin.related_coins.select(:id, :coin_key, :name, :symbol, :slug).to_a # Calling `to_a` ensures query executes on replica.
      @coin_obj = show_serializer(@coin)
      @how_to_article = coin_article_serializer(@coin.coin_articles.first)
      @top_coins_data = toplist_coins
      @watched_coins_data = watchlist_coins if current_user
    end

    # if is_ethereum?(@coin)
    #   @grouped_large_eth_signals = TradingSignal.get_large_transactions_by_period
    #   @recent_large_signals = TradingSignal.get_recent_large_transactions
    # end

    # TODO: Flag if a non-listed coin gets routed to this controller.
    if @coin.ico_listed?
      set_meta_tags(
        title: "#{@coin.symbol} ($#{@coin_price}) - #{@coin.name} Price Chart, Value, News, Market Cap",
        keywords: "#{@coin.name} price, #{@coin.name} chart, #{@coin.name} news, #{@coin.name} market cap, #{@coin.name} reddit, #{@coin.name} price prediction"
      )
      set_jsonld({
        "@context": "http://schema.org/",
        "@type": "WebPage",
        "name": @coin.name,
        "image": @coin.image_url,
        "dateModified": @coin.updated_at.iso8601,
        "url": request.original_url,
        "offers": {
          "@type": "Offer",
          "priceSpecification": {
              "@type":  "PriceSpecification",
              "priceCurrency": "USD",
              "price": @coin.price
          }
        }
      })
    else
      @data = @coin.market_info
      set_meta_tags(
        title: "#{@coin.name} ICO Review, #{@coin.name} Reviews, #{@coin.name} Coin",
        keywords: ''
      )
      render 'icos/show'
    end
  end

  protected

  def set_coin
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

  def show_serializer(coin)
    coin.as_json(
      only: %i[
        id name coin_key symbol slug ranking ico_status
        website whitepaper explorer twitter reddit medium github telegram
        release_date blockchain_tech algorithm ico_start_epoch ico_end_epoch
        updated_at team description
        ico_start_date ico_end_date ico_usd_raised ico_token_price_usd ico_tokens_sold
      ],
      methods: %i[
        news_data market_info is_being_watched summary price market_cap
        change1h change24h change7d volume24h available_supply max_supply total_supply fixed_supply
        image_url market_pairs total_market_pairs
      ]
    )
  end

  def coin_article_serializer(article)
    return nil unless article.present?

    article.as_json(
      only: %i[title]
    ).merge({
      path: coin_article_path(article)
    })
  end
end
