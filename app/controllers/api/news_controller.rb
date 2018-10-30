# This is the new version of the API endpoint to retrieve NewsItems
# based on a more sane query parameter setup.
class Api::NewsController < ApiController
  before_action :detect_news_feature, except: :index

  def index
    # Ensure fresh response on every request
    headers['Last-Modified'] = Time.now.httpdate

    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      news_items = nil

      if params[:frontPage].present? # For Front page (public; no feature flag)
        news_items = NewsItem.published.front_page
          .includes(:coins, :news_categories)
          .order_by_published
          .limit(5)
      else # For newsfeed (keep feature flag)
        news_feature_response = detect_news_feature
        return news_feature_response unless news_feature_response.nil?
        
        news_items = apply_news_feed_filters(params)
      end

      respond_success serialized(news_items)
    end
  end

  def show
    # Ensure fresh response on every request
    headers['Last-Modified'] = Time.now.httpdate

    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      @news_item = NewsItem.published.find(params[:id])

      respond_success serialized(@news_item)
    end
  end

  private

  def serialized(obj)
    data = obj.as_json(
      only: %i[id title summary feed_item_published_at updated_at url content],
      methods: %i[tag_scoped_coin_link_data categories]
    )
    format_item = Proc.new do |item, *args|
      item
        .except('tag_scoped_coin_link_data')
        .merge({
          coin_link_data: item['tag_scoped_coin_link_data'],
        })
    end

    # Handle both hashes and arrays of hashes
    if (data.kind_of?(Array))
      formatted_data = data.map(&format_item)
    else
      formatted_data = format_item.call(data)
    end
  end

  def apply_news_feed_filters(params)
    if params[:coinSlugs]
      coins = Coin.where(slug: params[:coinSlugs])
    end

    if feed_source_keys = params[:feedSources]
      feed_sources = FeedSource.active

      # Exclude reddit unless specified
      unless reddit = feed_source_keys.delete('reddit')
        feed_sources = feed_sources
          .where.not(id: FeedSource.reddit)
      end

      # Exclude twitter unless specified
      unless twitter = feed_source_keys.delete('twitter')
        feed_sources = feed_sources
          .where.not(id: FeedSource.twitter)
      end

      # Include remaining feed sources after removing twitter and reddit
      if feed_source_keys.present?
        feed_sources = FeedSource.where(site_hostname: feed_source_keys)
      end
    end

    if news_category_names = params[:categories]
      news_categories = NewsCategory.where(name: news_category_names)
    end

    NewsItems::WithFilters.call(
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
    .limit(25)
  end
end
