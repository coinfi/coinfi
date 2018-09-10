class AddMissingForeignKeys < ActiveRecord::Migration[5.1]
  def change
    add_foreign_key :articles, :coins, column: :coin_id
    add_foreign_key :author_profiles, :users, column: :user_id
    add_foreign_key :blazer_audits, :blazer_queries, column: :query_id
    add_foreign_key :blazer_audits, :users, column: :user_id
    add_foreign_key :blazer_checks, :users, column: :creator_id
    add_foreign_key :blazer_checks, :blazer_queries, column: :query_id
    add_foreign_key :blazer_dashboard_queries, :blazer_dashboards, column: :dashboard_id
    add_foreign_key :blazer_dashboard_queries, :blazer_queries, column: :query_id
    add_foreign_key :blazer_dashboards, :users, column: :creator_id
    add_foreign_key :blazer_queries, :users, column: :creator_id
    add_foreign_key :calendar_event_categorizations, :calendar_events, column: :calendar_event_id
    add_foreign_key :calendar_event_categorizations, :news_categories, column: :news_category_id
    add_foreign_key :calendar_event_coins, :calendar_events, column: :calendar_event_id
    add_foreign_key :calendar_event_coins, :coins, column: :coin_id
    add_foreign_key :calendar_events, :users, column: :user_id
    add_foreign_key :coin_excluded_countries, :coins, column: :coin_id
    add_foreign_key :coin_excluded_countries, :countries, column: :country_id
    add_foreign_key :coin_industries_coins, :coins, column: :coin_id
    add_foreign_key :coin_industries_coins, :coin_industries, column: :coin_industry_id
    add_foreign_key :contributor_submissions, :submission_categories, column: :submission_category_id
    add_foreign_key :contributor_submissions, :users, column: :user_id
    add_foreign_key :exchange_listings, :coins, column: :base_symbol_id
    add_foreign_key :exchange_listings, :exchanges, column: :exchange_id
    add_foreign_key :exchange_listings, :coins, column: :quote_symbol_id
    add_foreign_key :feed_sources, :coins, column: :coin_id
    add_foreign_key :influencer_reviews, :coins, column: :coin_id
    add_foreign_key :influencer_reviews, :influencers, column: :influencer_id
    add_foreign_key :news_coin_mentions, :coins, column: :coin_id
    add_foreign_key :news_coin_mentions, :news_items, column: :news_item_id
    add_foreign_key :news_item_categorizations, :news_categories, column: :news_category_id
    add_foreign_key :news_item_categorizations, :news_items, column: :news_item_id
    add_foreign_key :news_items, :feed_sources, column: :feed_source_id
    add_foreign_key :news_items, :users, column: :user_id
    add_foreign_key :taggings, :tags, column: :tag_id
    add_foreign_key :watchlist_items, :coins, column: :coin_id
    add_foreign_key :watchlist_items, :watchlists, column: :watchlist_id
    add_foreign_key :watchlists, :users, column: :user_id
  end
end
