module NewsItems
  class WithFilters
    def self.call(
      relation = NewsItem.all,
      coins: nil,
      feed_sources: nil,
      news_categories: nil,
      keywords: nil,
      published_since: nil,
      published_until: nil,
      trending: false
    )
      result = relation

      # Apply FeedSources filter
      if not feed_sources.nil?
        result = result.where(feed_source: feed_sources)
      else
        # Based on app/javascript/App/bundles/NewsfeedPage/utils.ts
        # If all selected coins are top 5 coins (@top_coin_slugs),
        # then we disable Reddit and Twitter
        # TODO: Reconcile split back/front-end logic
        top_coin_slugs = Coin.top(5).pluck(:slug)
        has_all_top_coins = unless coins.nil?
          (coins.length <= top_coin_slugs.length) &&
          coins.all? do |coin|
            top_coin_slugs.any? { |top_slug| top_slug == coin.slug }
          end
        end

        # Default feed sources
        if coins.blank? || has_all_top_coins
          result = result.where(feed_source: FeedSource.active.not_reddit.not_twitter)
        end
      end

      news_coin_mentions = NewsCoinMention.default_tagged

      # Apply Coins filter
      if !coins.nil?
        if !coins.is_a?(ActiveRecord::Relation)
          coins = Coin.where(slug: coins)
        end
        result = result.where(
            id: news_coin_mentions
                  .select(:news_item_id)
                  .where("news_coin_mentions.coin_id IN (?)", coins.select(:id))
                  .group(:news_item_id)
          )
      elsif feed_sources.nil? # && news_categories.nil?
        # Only top 20 coins or no coins exist
        # Absence of coin mentions is a very slow parallel seq scan.
        # Limit the scope to the desired publish time requirements.
        bindings = [
          (published_since.to_datetime if published_since.present?),
          (published_until.to_datetime if published_until.present?),
        ].compact
        result = result.where(
            # i.e., no coin mentions exist
            "news_items.id in (
              select news_items.id
              from news_items
              left join news_coin_mentions
                on news_items.id = news_coin_mentions.news_item_id
              where news_coin_mentions.id is null
              and #{published_since.present? ? 'news_items.feed_item_published_at > ?' : "news_items.feed_item_published_at > current_timestamp - interval '1 year'"
              }
              #{published_until.present? ? 'and news_items.feed_item_published_at < ?' : ''}
            )
            or news_items.id in (?)",
            *bindings,
            news_coin_mentions.select(:news_item_id).where(
              "news_coin_mentions.coin_id IN (?)",
              Coin.select(:id).where("coins.ranking <= ?", 20)
            ),
          )
      end

      # Apply NewsCategories filter
      # Remove for now since unused. Need to handle grouping of multiple results.
      # unless news_categories.nil?
      #   result = result
      #     .joins(:news_item_categorizations)
      #     .where(news_item_categorizations: {
      #       news_category_id: news_categories.select(:id)
      #     })
      # end

      if keywords.present?
        result = result.where('news_items.title ILIKE ?', "%#{keywords}%")
      end

      if published_since.present?
        result = result.where('news_items.feed_item_published_at > ?', published_since.to_datetime)
      else
        result = result.where("news_items.feed_item_published_at > current_timestamp - interval '1 year'")
      end

      if published_until.present?
        result = result.where('news_items.feed_item_published_at < ?', published_until.to_datetime)
      end

      if trending
        result = result.joins(:news_votes_trending) # 1-1 join
      end

      result
    end
  end
end
