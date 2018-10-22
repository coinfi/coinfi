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

      # Apply FeedSources filter
      if feed_sources.blank?
        # Default feed sources
        feed_sources = FeedSource.active
          .where.not(id: FeedSource.active.reddit)
          .where.not(id: FeedSource.active.twitter)
      end
      result = result.where(feed_source: feed_sources)

      # Apply Coins filter
      if coins.present?
        filter_by_coins = true
      else
        # Default coins
        coins = Coin.top(20)
        filter_by_coins = false
      end

      news_coin_mentions = NewsCoinMention.default_tagged.where(coin: coins)

      if filter_by_coins
        result = result
          .joins(:news_coin_mentions)
          .where("news_coin_mentions.id IN (?)", news_coin_mentions.select(:id))
      else
        result = result
          .left_outer_joins(:news_coin_mentions)
          .where("news_coin_mentions.id IN (?) OR news_coin_mentions.id IS NULL", news_coin_mentions.select(:id))
      end

      # Apply NewsCategories filter
      if news_categories.present?
        result = result
          .joins(:news_item_categorizations)
          .where(news_item_categorizations: {
            news_category_id: news_categories.select(:id)
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

      result.group(:id)
    end
  end
end
