module NewsHelper
  DEFAULT_NEWS_LIMIT = 25
  MAX_ACCEPTABLE_REPLICATION_LAG = ApplicationHelper::MAX_ACCEPTABLE_REPLICATION_LAG

  def default_news_query
    NewsItems::WithFilters.call(NewsItem.published)
      .includes(:coins, :news_categories)
      .order_by_published
      .limit(DEFAULT_NEWS_LIMIT)
  end

  def backup_default_news_query
    NewsItem.published
      .includes(:coins, :news_categories)
      .order_by_published
      .limit(DEFAULT_NEWS_LIMIT)
  end

  def serialize_news_items(news_items)
    data = news_items.as_json(
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

  def merge_news_items_with_votes(json_news_items)
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      news_item_ids = json_news_items.kind_of?(Array) ? json_news_items.map {|item| item['id']} : [json_news_items.dig('id')]
      vote_summary_hash = NewsVote.votes_by_news_item(news_item_ids: news_item_ids)
      user_vote_hash = {}
      if current_user.present?
        user_vote_hash = NewsVote.where(user: current_user)
          .where(news_item_id: news_item_ids)
          .pluck(:news_item_id, :vote)
          .to_h
      end

      add_vote_data = Proc.new do |item, *args|
        news_item_id = item['id']
        vote_hash = {
          vote: user_vote_hash.dig(news_item_id),
          vote_summary: vote_summary_hash.dig(news_item_id),
        }
        item.merge({votes: vote_hash})
      end

      # Handle both json hashes and arrays of json hashes
      if (json_news_items.kind_of?(Array))
        json_news_items.map(&add_vote_data)
      else
        add_vote_data.call(json_news_items)
      end
    end
  end

  def get_default_news_items(rewrite_cache: false)
    Rails.cache.fetch("default_news_items", force: rewrite_cache) do
      distribute_reads(max_lag: ApplicationController::MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
        news_items = default_news_query
        news_items = backup_default_news_query if news_items.empty? || news_items.length < DEFAULT_NEWS_LIMIT

        serialize_news_items(news_items)
      end
    end
  end
end
