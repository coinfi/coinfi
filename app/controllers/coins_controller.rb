class CoinsController < ApplicationController

  def index
    @coins = Coin.order(:ranking).page(params[:page])
    set_meta_tags(
      title: "Top Cryptocurrency Prices Live, Cryptocurrency Market Cap, Best Cryptocurrency Charts",
      keywords: "cryptocurrency, cryptocurrency news, cryptocurrency market, cryptocurrency prices, cryptocurrency charts, top cryptocurrency, best cryptocurrency"
    )
  end

  def icos
    @status = params[:status]
    redirect_to "/icos/upcoming" and return unless Coin::ICO_STATUSES.include?(@status)
    @coins = Coin.icos.where(ico_status: @status).page(params[:page])
    apply_filters
    set_meta_tags(
      keywords: "ico list, ico rating, ico alert, ico review, initial coin offering, initial coin offering list, ico initial coin offering"
    )
    render(layout: false) if params[:naked]
  end

  def show
    @coin = Coin.find(params[:id])
    @data = @coin.market_info
    @latest_news = @coin.articles.latest_news
    @upcoming_events = @coin.articles.upcoming_events

    if @coin.ico_status == "listed"
      title = "#{@coin.symbol} - #{@coin.name} Price Chart, Value, News, Market Cap"
      keywords = "#{@coin.name} price, #{@coin.name} chart, #{@coin.name} news, #{@coin.name} market cap, #{@coin.name} reddit, #{@coin.name} price prediction"
    else
      title = "#{@coin.name} ICO Review, #{@coin.name} Reviews, #{@coin.name} Coin"
      keywords = ""
    end

    set_meta_tags(
      title: title,
      keywords: keywords
    )
  end

  private

  def apply_filters
    return if filter_params.empty?
    @coins = @coins.ransack(parse_params).result
  end

  def parse_params
    filter_params.map { |key, value|
      parse_param(key.to_sym, value)
    }.compact.to_h
  end

  def parse_param key, value
    case key
      when :closingDate
        return [:ico_end_date_gteq, parse_date(value)]
      when :startingDate
        return [:ico_start_date_gteq, parse_date(value)]
      when :hardCapMin
        return [:ico_fundraising_goal_usd_gteq, value.to_i * 1000000]
      when :hardCapMax
        return [:ico_fundraising_goal_usd_lteq, value.to_i * 1000000]
      when :coinIndustries
        industry_ids = CoinIndustry.where(name: value.values).pluck(:id)
        coin_ids = CoinIndustriesCoin.where(coin_industry_id: industry_ids).pluck(:coin_id)
        return [:id_in, coin_ids]
    end
  end

  def filter_params
    params.permit! 
    p = HashWithIndifferentAccess.new params[:q]
    return [] unless p
    if p[:hardCap]
      p[:hardCapMin] = p[:hardCap][:min]
      p[:hardCapMax] = p[:hardCap][:max]
    end
    p
  end

  def parse_date str
    DateTime.parse(str).to_i
  end

end
