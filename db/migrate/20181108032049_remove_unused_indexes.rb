class RemoveUnusedIndexes < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def change
    remove_index :coins, column: :volume24, algorithm: :concurrently # name: "index_coins_on_volume24"
    remove_index :coins, column: :market_cap, algorithm: :concurrently # name: "index_coins_on_market_cap"
    remove_index :coins, column: :price, algorithm: :concurrently # name: "index_coins_on_price"
    remove_index :coins, column: :category, algorithm: :concurrently # name: "index_coins_on_category"
    remove_index :exchange_listings, column: :exchange_id, algorithm: :concurrently # name: "index_exchange_listings_on_exchange_id"
    remove_index :watchlist_items, column: :position, algorithm: :concurrently # name: "index_watchlist_items_on_position"
    remove_index :taggings, column: [:taggable_id, :taggable_type, :tagger_id, :context], name: "taggings_idy", algorithm: :concurrently
    remove_index :taggings, column: [:taggable_id, :taggable_type, :context], algorithm: :concurrently # name: "index_taggings_on_taggable_id_and_taggable_type_and_context"
    remove_index :taggings, column: :context, algorithm: :concurrently # name: "index_taggings_on_context"
    remove_index :taggings, column: :taggable_type, algorithm: :concurrently # name: "index_taggings_on_taggable_type"
    remove_index :taggings, column: :tagger_id, algorithm: :concurrently # name: "index_taggings_on_tagger_id"
    remove_index :taggings, column: [:tagger_id, :tagger_type], algorithm: :concurrently # name: "index_taggings_on_tagger_id_and_tagger_type"
    remove_index :blazer_audits, column: :query_id, algorithm: :concurrently # name: "index_blazer_audits_on_query_id"
    remove_index :articles, column: :importance, algorithm: :concurrently # name: "index_articles_on_importance"
    remove_index :blazer_queries, column: :creator_id, algorithm: :concurrently # name: "index_blazer_queries_on_creator_id"
    remove_index :contributor_submissions, column: :submission_category_id, algorithm: :concurrently # name: "index_contributor_submissions_on_submission_category_id"
    remove_index :blazer_checks, column: :creator_id, algorithm: :concurrently # name: "index_blazer_checks_on_creator_id"
    remove_index :blazer_dashboard_queries, column: :dashboard_id, algorithm: :concurrently # name: "index_blazer_dashboard_queries_on_dashboard_id"
    remove_index :blazer_dashboards, column: :creator_id, algorithm: :concurrently # name: "index_blazer_dashboards_on_creator_id"
    remove_index :calendar_event_categorizations, column: :calendar_event_id, algorithm: :concurrently # name: "index_calendar_event_categorizations_on_calendar_event_id"
    remove_index :calendar_event_coins, column: :calendar_event_id, algorithm: :concurrently # name: "index_calendar_event_coins_on_calendar_event_id"
    remove_index :calendar_events, column: :import_id, algorithm: :concurrently # name: "index_calendar_events_on_import_id"
    remove_index :friendly_id_slugs, column: [:slug, :sluggable_type], algorithm: :concurrently # name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    remove_index :friendly_id_slugs, column: :sluggable_id, algorithm: :concurrently # name: "index_friendly_id_slugs_on_sluggable_id"
    remove_index :friendly_id_slugs, column: :sluggable_type, algorithm: :concurrently # name: "index_friendly_id_slugs_on_sluggable_type"
  end
end
