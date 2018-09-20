class NewsController < ApplicationController
  before_action :set_body_class
  before_action :set_view_data

  def index
    return render_404 unless has_news_feature?
  end

  protected

  def set_view_data
    @feed_sources = (FeedSource.feed_types - ['general']) +
      FeedSource.where(feed_type: 'general').pluck(:site_hostname)
    @top_coin_slugs = Coin.top(5).pluck(:slug)
    @categories = NewsCategory.pluck(:name)

    @top_coins_data = coinlist_serializer(
      Rails.cache.fetch("coins/toplist", expires_in: 1.hour) do
        Coin.order(:ranking).limit(20)
      end
    )
    @watched_coins_data = coinlist_serializer(
      current_user.watchlist.coins.order(:ranking)
    ) if current_user
  end

  def set_body_class
    @body_class = 'page page--fullscreen'
  end

  def coinlist_serializer(coins)
    coins.as_json(
      only: %i[id name symbol slug price_usd],
      methods: %i[market_info]
    )
  end
end
