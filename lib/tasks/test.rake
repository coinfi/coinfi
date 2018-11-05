namespace :scratch do
  task :run_sql => :environment do
    # EXPLAIN ANALYSE SELECT "news_items".* FROM "news_items"
    # LEFT OUTER JOIN "news_coin_mentions" ON "news_items"."id" = "news_coin_mentions"."news_item_id"
    # LEFT OUTER JOIN "coins" ON "news_coin_mentions"."coin_id" = "coins"."id"
    # JOIN "feed_sources" ON "news_items"."feed_source_id" = "feed_sources"."id"
    # WHERE "news_items"."is_published" = true
    # AND "feed_sources"."is_active" = true
    # AND "feed_sources"."feed_type" <> 'reddit'
    # AND "feed_sources"."feed_type" <> 'twitter'
    # AND ("coins"."ranking" >= 20 OR "news_coin_mentions"."id" IS NULL)
    # GROUP BY "news_items"."id"
    # ORDER BY "news_items"."feed_item_published_at" DESC;

    # news_items = NewsItem.left_outer_joins(:coins => { :mentions => :news_item })
    #   .joins(:feed_source)
    #   .published
    #   .merge(FeedSource.active.not_reddit.not_twitter)
    #   .merge(Coin.quick_top(20).or(NewsCoinMention.where(id: nil)))
    #   .limit(25)

    # puts news_items.to_sql

    # news_items.as_json()

    # news_items = NewsItems::WithFilters.call(
    #   NewsItem.published,
    #   coins: ['bitcoin']
    # )
    #   .includes(:coins, :news_categories)
    #   .order_by_published
    #   .limit(25)

    # data = news_items.as_json(
    #   only: %i[id title summary feed_item_published_at updated_at url content],
    #   methods: %i[tag_scoped_coin_link_data categories]
    # )
    # format_item = Proc.new do |item, *args|
    #   item
    #     .except('tag_scoped_coin_link_data')
    #     .merge({
    #       coin_link_data: item['tag_scoped_coin_link_data'],
    #     })
    # end

    # # Handle both hashes and arrays of hashes
    # if (data.kind_of?(Array))
    #   formatted_data = data.map(&format_item)
    # else
    #   formatted_data = format_item.call(data)
    # end

    Coin.historical_total_market_data

  end
end