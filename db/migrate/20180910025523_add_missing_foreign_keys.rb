class AddMissingForeignKeys < ActiveRecord::Migration[5.1]
  def change
    add_foreign_key :author_profiles, :users, column: :user_id
    add_foreign_key :calendar_event_categorizations, :calendar_events, column: :calendar_event_id
    add_foreign_key :calendar_event_categorizations, :news_categories, column: :news_category_id
    add_foreign_key :calendar_event_coins, :calendar_events, column: :calendar_event_id
    add_foreign_key :calendar_event_coins, :coins, column: :coin_id
    add_foreign_key :coin_industries_coins, :coins, column: :coin_id
    add_foreign_key :coin_industries_coins, :coin_industries, column: :coin_industry_id
    add_foreign_key :news_coin_mentions, :coins, column: :coin_id
    add_foreign_key :news_coin_mentions, :news_items, column: :news_item_id
    add_foreign_key :news_item_categorizations, :news_categories, column: :news_category_id
    add_foreign_key :news_item_categorizations, :news_items, column: :news_item_id
    add_foreign_key :news_items, :feed_sources, column: :feed_source_id
    add_foreign_key :watchlist_items, :coins, column: :coin_id
    add_foreign_key :watchlist_items, :watchlists, column: :watchlist_id
    add_foreign_key :watchlists, :users, column: :user_id
  end
end
