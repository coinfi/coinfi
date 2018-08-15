# This is the new version of the API endpoint to retrieve NewsItems
# based on a more sane query parameter setup.
class Api::NewsController < ApiController
  before_action :detect_news_feature

  def index
    # Ensure fresh response on every request
    headers['Last-Modified'] = Time.now.httpdate

    if params[:coinSlugs]
      coin_slugs = params[:coinSlugs].split(',')
    end
    coin_ids = Coin.where(slug: coin_slugs).pluck(:id) if coin_slugs
    coin_ids = Coin.top(20).ids unless coin_ids

    @news_items = NewsItem.published.all
    feed_sources = FeedSource.active.all

    if params[:coins].present?
      @news_items = @news_items.joins(:news_coin_mentions).where(news_coin_mentions: { coin: coin_ids })
    end

    # Showing default coins
    if coin_ids == params[:coinIDs]
      mention_ids = NewsCoinMention.where(coin_id: coin_ids).pluck(:news_item_id)
      feed_sources = FeedSource.general
      @news_items = @news_items.or(@news_items.where(id: mention_ids))
    end

    if params[:feedSources].present?
      reddit = params[:feedSources].delete('reddit')
      twitter = params[:feedSources].delete('twitter')

      if params[:feedSources].present? # Still remaining feedsource params after removing twitter and reddit
        feed_sources = FeedSource.where(site_hostname: params[:feedSources])
      end

      feed_sources = feed_sources.or(FeedSource.active.reddit) if reddit
      feed_sources = feed_sources.or(FeedSource.active.twitter) if twitter
    end

    if params[:categories].present?
      category_ids = NewsCategory.where(name: params[:categories]).ids
      news_item_ids_for_category_filter = NewsItemCategorization.where(news_category_id: category_ids).pluck(:news_item_id)
      if news_item_ids_for_category_filter.present?
        @news_items = @news_items.where(id: news_item_ids_for_category_filter)
      end
    end

    if params[:keywords].present?
      @news_items = @news_items.where('title ILIKE ?', "%#{params[:keywords]}%")
    end

    if params[:publishedSince].present?
      @news_items = @news_items.where('feed_item_published_at > ?', params[:publishedSince].to_datetime)
    end

    if params[:publishedUntil].present?
      @news_items = @news_items.where('feed_item_published_at < ?', params[:publishedUntil].to_datetime)
    end

    @news_items = @news_items.includes(:coins, :news_categories).where(feed_source: feed_sources).order_by_published.limit(25)

    respond_success serialized(@news_items)
  end

  private

  def serialized(obj)
    obj.as_json(
      only: %i[id title summary feed_item_published_at updated_at url content],
      methods: %i[coin_link_data categories]
    )
  end
end
