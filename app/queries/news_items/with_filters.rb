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
      coins = Coin.top(20) unless coins.present?

      news_coin_mentions = NewsCoinMention.default_tagged.where(coin: coins)
      result = result
        .left_outer_joins(:news_coin_mentions)
        .where("news_coin_mentions.id IN (?) OR news_coin_mentions.id IS NULL", news_coin_mentions.select(:id))

      # Apply FeedSources filter
      if feed_sources.blank?
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

      result.distinct()
    end
  end
end
