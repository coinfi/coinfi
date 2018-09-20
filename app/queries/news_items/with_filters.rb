module NewsItems
  class WithFilters
    def self.call(
      relation = NewsItem.all,
      coins: nil,
      feed_sources: nil,
      news_categories: nil,
      keywords: nil,
      published_since: nil,
      published_until: nil
    )
      result = relation

      # Apply Coins filter
      unless coins.present?
        # Default coins
        coins = Coin.top(20)
      end
      news_coin_mentions = NewsCoinMention.default_tagged
        .where(coin: coins)
      result = result
        .joins(:news_coin_mentions)
        .where(news_coin_mentions: {
          id: news_coin_mentions
        })

      # Apply FeedSources filter
      unless feed_sources.present?
        # Default feed sources
        feed_sources = FeedSource.all
          .where.not(id: FeedSource.active.reddit)
          .where.not(id: FeedSource.active.twitter)
      end
      result = result.where(feed_source: feed_sources)

      # Apply NewsCategories filter
      if news_categories.present?
        result = result
          .joins(:news_item_categorizations)
          .where(news_item_categorizations: {
            id: news_categories
          })
      end

      if keywords.present?
        result = result.where('title ILIKE ?', "%#{keywords}%")
      end

      if published_since.present?
        result = result.where('feed_item_published_at > ?', published_since.to_datetime)
      end

      if published_until.present?
        result = result.where('feed_item_published_at < ?', published_until.to_datetime)
      end

      result
    end
  end
end
