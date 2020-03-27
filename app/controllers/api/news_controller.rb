# This is the new version of the API endpoint to retrieve NewsItems
# based on a more sane query parameter setup.
class Api::NewsController < ApiController
  include NewsHelper

  def index
    # Ensure fresh response on every request
    headers['Last-Modified'] = Time.now.httpdate

    if params[:frontPage].present? # For Front page
      set_front_page_news_items
      return respond_success @news_items
    end

    set_news_items_with_filters(params)
    respond_success @news_items
  end

  def show
    # Ensure fresh response on every request
    headers['Last-Modified'] = Time.now.httpdate

    @news_item = NewsItem.published.find(params[:id])
    serialized_news_item = serialize_news_items(@news_item)

    if current_user.present?
      serialized_news_item['user_vote'] = current_user.voted_as_when_voted_for(@news_item)
    end

    respond_success serialized_news_item
  end

  private

  def set_front_page_news_items(limit = 5)
    @news_items = get_default_serialized_news_items(limit)
  end

  def set_news_items_with_filters(params)
    if coin_slugs = params[:coinSlugs]
      coins = Coin.where(slug: coin_slugs)
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

    trending = ActiveRecord::Type::Boolean.new.deserialize(params[:trending])

    if no_filters?
      @news_items = get_default_serialized_news_items
    else
      @news_items = serialize_news_items(
        NewsItems::WithFilters.call(
          NewsItem.published,
          coins: coins || nil,
          feed_sources: feed_sources || nil,
          news_categories: news_categories || nil,
          keywords: params[:keywords],
          published_since: params[:publishedSince],
          published_until: params[:publishedUntil],
          trending: trending || false,
        )
        .order_by_published
        .limit(25)
      )
    end
  end

  def get_default_serialized_news_items(limit = 25)
    news_item_ids = get_default_news_item_ids
    serialize_news_items(NewsItem.where(id: news_item_ids)
      .order_by_published
      .limit(limit))
  end

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
    elsif params[:trending]
      return false
    end

    true
  end
end
