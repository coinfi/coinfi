class CoinsController < ApplicationController
  before_action :set_coin, only: [:show]

  def index
    @coin_count = Coin.legit.listed.count
    set_meta_tags(
      title: "Top Cryptocurrency Prices Live, Cryptocurrency Market Cap, Best Cryptocurrency Charts",
      keywords: "cryptocurrency, cryptocurrency news, cryptocurrency market, cryptocurrency prices, cryptocurrency charts, top cryptocurrency, best cryptocurrency"
    )
  end

  def show
    @data = @coin.market_info
    @coin_price = @data["price_usd"] # TODO: Consolidate price and volume from data warehouse and remove from coins table.
    @latest_news = @coin.articles.latest_news
    @upcoming_events = @coin.articles.upcoming_events

    if @coin.symbol && ENV['MODE_ACCESS_KEY']
      base_mode_analytics_url = "https://modeanalytics.com/coinfi/reports/ab6bace449d6/embed?"
      # Keys need to be in alphabetical order!
      mode_params = {
        access_key: ENV['MODE_ACCESS_KEY'],
        max_age: 60 * 60 * 12, # in seconds; equivalent to 12 hours
        param_token_symbol: @coin.symbol,
        timestamp: Time.now.to_i
      }

      # <iframe src="https://modeanalytics.com/coinfi/reports/ab6bace449d6/embed
      # ?access_key=[xxx]&max_age=[xxxx in seconds]&param_[foo=bar]&timestamp=[xxx]&signature=[xxx]"
      # width="100%" height="300" frameborder="0"></iframe>
      @mode_analytics_url = ModeAnalytics.sign_url(base_mode_analytics_url + mode_params.to_query)
    else
      @mode_analytics_url = nil
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

  private

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
    coin_by_id = Coin.find(coin_id)
    # Redirect to the same action with the slug
    redirect_to :action => action_name, :id_or_slug => coin_by_id.slug
  end
end
