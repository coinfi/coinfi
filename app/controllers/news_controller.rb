class NewsController < ApplicationController
  before_action :set_body_class, :set_fluid, :set_exchange_rates, :hide_footer, :show_dark_mode,
                :set_view_data
  before_action :set_default_news_items, only: [:index, :show]

  include NewsHelper
  include CoinListHelper
  include CurrencyHelper

  def index
    set_meta_tags(
      title: "Latest Cryptocurrency News Today - Current Crypto News Today",
      description: "CoinFi’s #1 crypto news aggregator gives you the latest cryptocurrency news, so you can be the first to know what news moved the crypto markets today."
    )
  end

  def coin_index
    coin = nil
    Rollbar.silenced {
      coin = Coin.find_by!(slug: params[:coin_slug])
    }

    @coin_with_details_data = serialize_coin_with_details(coin)
    @news_items_data = serialize_news_items(
      NewsItems::WithFilters.call(NewsItem.published, coins: [coin])
        .includes(:coins, :news_categories)
        .order_by_published
        .limit(25)
    )

    set_meta_tags(
      title: "Latest (#{coin.symbol}) #{coin.name} News - #{coin.name} Crypto News (#{Date.today.strftime("%b %e, %Y")})"
    )
  end

  def show
    @force_drawer = params[:force_drawer].present?
    news_item = NewsItem.published.find(params[:id])
    @news_item_data = serialize_news_items(news_item)

    set_meta_tags(
      title: "CoinFi News - #{news_item.title}",
      canonical: news_item.url,
      twitter: {
        card: "summary",
        site: "@coin_fi",
        title: news_item.title,
        description: news_item.summary,
      }
    )
  end

  protected

  def set_default_news_items
    news_item_ids = get_default_news_item_ids
    @news_items_data = serialize_news_items(NewsItem.where(id: news_item_ids))
  end

  def set_view_data
    @feed_sources = (FeedSource.feed_types - ['general']) +
      FeedSource.active.general.pluck(:site_hostname)
    @top_coin_slugs = Coin.top(5).pluck(:slug)
    @categories = NewsCategory.pluck(:name)

    @top_coins_data = toplist_coins
    @watched_coins_data = watchlist_coins if current_user
    @theme = cookies[:theme]
    @user_votes = serialize_user_news_votes(current_user.votes.for_type(NewsItem)) if current_user
  end

  def set_body_class
    @body_class = 'page page--fullscreen'
  end

  def serialize_coin_with_details(coin)
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
      price: coin.price,
      prices_data: coin.prices_data,
      # hourly_prices_data: coin.hourly_prices_data,
      news_data: coin.news_data,
      market_info: coin.market_info,
      is_being_watched: coin.is_being_watched,
      related_coins_data: related_coins_data,
      summary: coin.summary,
    }
  end
end
