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
  end

  def set_body_class
    @body_class = 'page page--fullscreen'
  end
end
