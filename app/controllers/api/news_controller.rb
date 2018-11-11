# This is the new version of the API endpoint to retrieve NewsItems
# based on a more sane query parameter setup.
class Api::NewsController < ApiController
  before_action :detect_news_feature

  include NewsHelper

  def index
    # Ensure fresh response on every request
    headers['Last-Modified'] = Time.now.httpdate

    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      if params[:coinSlugs]
        coins = Coin.where(slug: params[:coinSlugs])
      end

      if feed_source_keys = params[:feedSources]
        feed_sources = FeedSource.active

        # Exclude reddit unless specified
        unless reddit = feed_source_keys.delete('reddit')
          feed_sources = feed_sources.not_reddit
        end

        # Exclude twitter unless specified
        unless twitter = feed_source_keys.delete('twitter')
          feed_sources = feed_sources.not_twitter
        end

        # Include remaining feed sources after removing twitter and reddit
        if feed_source_keys.present?
          feed_sources = FeedSource.where(site_hostname: feed_source_keys)
        end
      end

      if news_category_names = params[:categories]
        news_categories = NewsCategory.where(name: news_category_names)
      end

      news_items = if no_filters?
          get_default_news_items
        else
          serialize_news_items(NewsItems::WithFilters.call(
            NewsItem.published,
            coins: coins || nil,
            feed_sources: feed_sources || nil,
            news_categories: news_categories || nil,
            keywords: params[:keywords],
            published_since: params[:publishedSince],
            published_until: params[:publishedUntil],
          )
            .includes(:coins, :news_categories)
            .order_by_published
            .limit(25))
        end

      respond_success news_items
    end
  end


  def show
    # Ensure fresh response on every request
    headers['Last-Modified'] = Time.now.httpdate

    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      @news_item = NewsItem.published.find(params[:id])

      respond_success serialize_news_items(@news_item)
    end
  end

  private
  def no_filters?
    if params[:coinSlugs]
      return false
    elsif params[:feedSources]
      return false
    elsif params[:categories]
      return false
    elsif params[:keywords]
      return false
    elsif params[:publishedSince]
      return false
    elsif params[:publishedUntil]
      return false
    end

    true
  end
end
