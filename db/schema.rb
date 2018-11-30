# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20181123072657) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "dblink"
  enable_extension "pg_stat_statements"
  enable_extension "pg_trgm"

  create_table "articles", force: :cascade do |t|
    t.bigint "coin_id"
    t.string "url"
    t.string "title"
    t.text "summary"
    t.datetime "published_date"
    t.bigint "published_epoch"
    t.decimal "importance"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["coin_id"], name: "index_articles_on_coin_id"
  end

  create_table "author_profiles", force: :cascade do |t|
    t.bigint "user_id"
    t.string "name"
    t.string "company"
    t.string "role"
    t.string "website_url"
    t.string "twitter_url"
    t.string "linkedin_url"
    t.string "photo"
    t.text "bio"
    t.string "investing_style"
    t.string "slug"
    t.index ["slug"], name: "index_author_profiles_on_slug"
    t.index ["user_id"], name: "index_author_profiles_on_user_id"
  end

  create_table "blazer_audits", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "query_id"
    t.text "statement"
    t.string "data_source"
    t.datetime "created_at"
    t.index ["user_id"], name: "index_blazer_audits_on_user_id"
  end

  create_table "blazer_checks", force: :cascade do |t|
    t.bigint "creator_id"
    t.bigint "query_id"
    t.string "state"
    t.string "schedule"
    t.text "emails"
    t.string "check_type"
    t.text "message"
    t.datetime "last_run_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["query_id"], name: "index_blazer_checks_on_query_id"
  end

  create_table "blazer_dashboard_queries", force: :cascade do |t|
    t.bigint "dashboard_id"
    t.bigint "query_id"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["query_id"], name: "index_blazer_dashboard_queries_on_query_id"
  end

  create_table "blazer_dashboards", force: :cascade do |t|
    t.bigint "creator_id"
    t.text "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "blazer_queries", force: :cascade do |t|
    t.bigint "creator_id"
    t.string "name"
    t.text "description"
    t.text "statement"
    t.string "data_source"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "calendar_event_categorizations", force: :cascade do |t|
    t.bigint "calendar_event_id"
    t.bigint "news_category_id"
    t.index ["news_category_id"], name: "index_calendar_event_categorizations_on_news_category_id"
  end

  create_table "calendar_event_coins", force: :cascade do |t|
    t.bigint "calendar_event_id"
    t.bigint "coin_id"
    t.index ["coin_id"], name: "index_calendar_event_coins_on_coin_id"
  end

  create_table "calendar_events", force: :cascade do |t|
    t.bigint "user_id"
    t.string "name"
    t.text "description"
    t.datetime "date_event"
    t.datetime "date_added"
    t.string "source_url"
    t.string "screenshot_url"
    t.string "status"
    t.bigint "approvals"
    t.bigint "disapprovals"
    t.integer "confidence"
    t.bigint "import_id"
    t.index ["user_id"], name: "index_calendar_events_on_user_id"
  end

  create_table "coin_excluded_countries", force: :cascade do |t|
    t.bigint "coin_id"
    t.bigint "country_id"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["coin_id"], name: "index_coin_excluded_countries_on_coin_id"
    t.index ["country_id"], name: "index_coin_excluded_countries_on_country_id"
  end

  create_table "coin_industries", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_coin_industries_on_name", unique: true
  end

  create_table "coin_industries_coins", force: :cascade do |t|
    t.bigint "coin_id", null: false
    t.bigint "coin_industry_id", null: false
    t.index ["coin_id"], name: "index_coin_industries_coins_on_coin_id"
    t.index ["coin_industry_id"], name: "index_coin_industries_coins_on_coin_industry_id"
  end

  create_table "coins", force: :cascade do |t|
    t.string "name", null: false
    t.string "symbol"
    t.string "slug"
    t.string "category"
    t.jsonb "market_cap"
    t.jsonb "price"
    t.jsonb "volume24"
    t.decimal "change1h"
    t.decimal "change24h"
    t.decimal "change7d"
    t.bigint "available_supply"
    t.bigint "max_supply"
    t.string "website"
    t.string "website2"
    t.string "explorer"
    t.string "explorer2"
    t.string "forum"
    t.string "forum2"
    t.string "twitter"
    t.string "reddit"
    t.string "medium"
    t.string "github"
    t.string "whitepaper"
    t.date "release_date"
    t.string "algorithm"
    t.string "proof_type"
    t.string "image_url"
    t.boolean "is_premined"
    t.integer "tier"
    t.integer "ranking"
    t.integer "last_synced"
    t.text "intro"
    t.text "summary"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "ico_status"
    t.bigint "ico_usd_raised"
    t.bigint "ico_start_epoch"
    t.bigint "ico_end_epoch"
    t.decimal "ico_token_price_usd", precision: 24, scale: 16
    t.decimal "ico_token_price_btc", precision: 24, scale: 16
    t.decimal "ico_token_price_eth", precision: 24, scale: 16
    t.string "ico_personal_cap_min"
    t.string "ico_personal_cap_max"
    t.decimal "ico_fundraising_goal_usd", precision: 18, scale: 2
    t.decimal "ico_fundraising_goal_eth", precision: 24, scale: 16
    t.decimal "ico_fundraising_status_usd", precision: 18, scale: 2
    t.decimal "ico_fundraising_status_eth", precision: 24, scale: 16
    t.decimal "ico_tokens_sold", precision: 32, scale: 16
    t.float "ico_returns_usd"
    t.float "ico_returns_btc"
    t.float "ico_returns_eth"
    t.string "blockchain_tech"
    t.string "token_type"
    t.jsonb "exchanges", array: true
    t.string "previous_name"
    t.integer "influencer_reviews_count"
    t.datetime "ico_start_date"
    t.datetime "ico_end_date"
    t.string "coin_key"
    t.boolean "is_listed"
    t.jsonb "external_url"
    t.string "eth_address"
    t.string "country"
    t.float "share_of_tokens_for_sale"
    t.jsonb "external_key"
    t.string "facebook"
    t.string "telegram"
    t.decimal "total_supply", precision: 32, scale: 2
    t.text "description"
    t.jsonb "team"
    t.jsonb "external_rating"
    t.integer "cmc_id"
    t.integer "token_decimals"
    t.index ["coin_key"], name: "index_coins_on_coin_key", unique: true
    t.index ["influencer_reviews_count"], name: "index_coins_on_influencer_reviews_count"
    t.index ["name"], name: "index_coins_on_name"
    t.index ["ranking"], name: "index_coins_on_ranking"
    t.index ["slug"], name: "index_coins_on_slug", unique: true
  end

  create_table "contributor_submissions", force: :cascade do |t|
    t.bigint "user_id"
    t.string "title"
    t.text "summary"
    t.text "content"
    t.bigint "submission_category_id"
    t.integer "status", default: 0, null: false
    t.text "disclosure"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_contributor_submissions_on_user_id"
  end

  create_table "countries", force: :cascade do |t|
    t.string "name"
    t.string "alpha2"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "exchange_listings", force: :cascade do |t|
    t.bigint "exchange_id"
    t.string "ccxt_exchange_id"
    t.string "symbol"
    t.string "quote_symbol"
    t.bigint "quote_symbol_id"
    t.string "base_symbol"
    t.bigint "base_symbol_id"
    t.datetime "detected_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["base_symbol_id"], name: "index_exchange_listings_on_base_symbol_id"
    t.index ["detected_at"], name: "index_exchange_listings_on_detected_at"
    t.index ["quote_symbol"], name: "index_exchange_listings_on_quote_symbol"
    t.index ["quote_symbol_id"], name: "index_exchange_listings_on_quote_symbol_id"
  end

  create_table "exchanges", force: :cascade do |t|
    t.string "ccxt_id"
    t.string "name"
    t.string "slug"
    t.string "www_url"
    t.string "logo_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ccxt_id"], name: "index_exchanges_on_ccxt_id", unique: true
  end

  create_table "feed_sources", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.string "feed_url", null: false
    t.string "site_hostname", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "feed_type"
    t.boolean "is_subscribed", default: false
    t.datetime "last_received_data_at"
    t.bigint "coin_id"
    t.boolean "is_active", default: true
    t.index ["coin_id"], name: "index_feed_sources_on_coin_id"
    t.index ["feed_type"], name: "index_feed_sources_on_feed_type"
    t.index ["feed_url"], name: "index_feed_sources_on_feed_url", unique: true
    t.index ["is_active"], name: "index_feed_sources_on_is_active"
    t.index ["name"], name: "index_feed_sources_on_name", unique: true
  end

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at"
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
  end

  create_table "influencer_reviews", force: :cascade do |t|
    t.bigint "coin_id"
    t.bigint "influencer_id"
    t.string "url"
    t.string "rating"
    t.text "review"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "review_date"
    t.index ["coin_id"], name: "index_influencer_reviews_on_coin_id"
    t.index ["influencer_id"], name: "index_influencer_reviews_on_influencer_id"
  end

  create_table "influencers", force: :cascade do |t|
    t.string "name"
    t.string "website"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "news_categories", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_news_categories_on_name", unique: true
  end

  create_table "news_coin_mentions", force: :cascade do |t|
    t.bigint "coin_id"
    t.bigint "news_item_id"
    t.boolean "is_machine_tagged", default: false
    t.index ["coin_id"], name: "index_news_coin_mentions_on_coin_id"
    t.index ["is_machine_tagged"], name: "index_news_coin_mentions_on_is_machine_tagged"
    t.index ["news_item_id", "coin_id", "is_machine_tagged"], name: "unique_index_news_coin_mention", unique: true
    t.index ["news_item_id", "coin_id"], name: "index_news_coin_mentions_on_news_item_id_and_coin_id"
    t.index ["news_item_id"], name: "index_news_coin_mentions_on_news_item_id"
  end

  create_table "news_item_categorizations", force: :cascade do |t|
    t.bigint "news_item_id"
    t.bigint "news_category_id"
    t.index ["news_category_id"], name: "index_news_item_categorizations_on_news_category_id"
    t.index ["news_item_id"], name: "index_news_item_categorizations_on_news_item_id"
  end

  create_table "news_item_raws", force: :cascade do |t|
    t.string "feed_item_id"
    t.string "source"
    t.string "websub_hub"
    t.jsonb "feed_item_json"
    t.boolean "is_processed", default: false
    t.integer "news_item_id"
    t.boolean "was_replaced_by_an_update"
    t.index ["news_item_id"], name: "index_news_item_raws_on_news_item_id"
  end

  create_table "news_items", force: :cascade do |t|
    t.bigint "feed_source_id", null: false
    t.string "feed_item_id", null: false
    t.string "url", null: false
    t.string "title", null: false
    t.text "summary"
    t.text "content"
    t.string "actor_id"
    t.datetime "feed_item_published_at", null: false
    t.datetime "feed_item_updated_at", null: false
    t.jsonb "feed_item_json"
    t.string "websub_hub"
    t.integer "importance", default: 0
    t.boolean "is_published", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_human_tagged"
    t.datetime "last_human_tagged_on"
    t.datetime "last_machine_tagged_on"
    t.bigint "user_id"
    t.jsonb "coin_ids"
    t.index ["feed_item_published_at"], name: "index_news_items_on_feed_item_published_at"
    t.index ["feed_source_id", "feed_item_id"], name: "index_news_items_on_feed_source_id_and_feed_item_id", unique: true
    t.index ["feed_source_id"], name: "index_news_items_on_feed_source_id"
    t.index ["is_published"], name: "index_news_items_on_is_published"
    t.index ["title"], name: "index_news_items_on_title"
    t.index ["user_id"], name: "index_news_items_on_user_id"
  end

  create_table "signals_telegram_subscriptions", force: :cascade do |t|
    t.bigint "signals_telegram_user_id"
    t.bigint "coin_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["coin_id"], name: "index_signals_telegram_subscriptions_on_coin_id"
    t.index ["signals_telegram_user_id"], name: "index_sts_on_signals_telegram_user_id"
  end

  create_table "signals_telegram_users", force: :cascade do |t|
    t.bigint "user_id"
    t.string "telegram_username"
    t.string "telegram_chat_id"
    t.datetime "started_at"
    t.boolean "is_active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "telegram_id"
    t.index ["telegram_chat_id"], name: "index_signals_telegram_users_on_telegram_chat_id", unique: true
    t.index ["telegram_username"], name: "index_signals_telegram_users_on_telegram_username", unique: true
    t.index ["user_id"], name: "index_signals_telegram_users_on_user_id"
  end

  create_table "staked_cofi_transactions", force: :cascade do |t|
    t.bigint "user_id"
    t.string "txn_block_number"
    t.datetime "txn_timestamp"
    t.string "txn_hash"
    t.string "txn_block_hash"
    t.string "txn_from"
    t.string "txn_to"
    t.string "txn_value"
    t.integer "txn_token_decimal"
    t.boolean "is_txn_confirmations_gte_10"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["is_txn_confirmations_gte_10"], name: "index_staked_cofi_transactions_on_is_txn_confirmations_gte_10"
    t.index ["txn_block_number"], name: "index_staked_cofi_transactions_on_txn_block_number"
    t.index ["txn_hash"], name: "index_staked_cofi_transactions_on_txn_hash", unique: true
    t.index ["user_id"], name: "index_staked_cofi_transactions_on_user_id"
  end

  create_table "submission_categories", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "taggings", id: :serial, force: :cascade do |t|
    t.integer "tag_id"
    t.string "taggable_type"
    t.integer "taggable_id"
    t.string "tagger_type"
    t.integer "tagger_id"
    t.string "context", limit: 128
    t.datetime "created_at"
    t.index ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
    t.index ["taggable_id"], name: "index_taggings_on_taggable_id"
  end

  create_table "tags", id: :serial, force: :cascade do |t|
    t.string "name"
    t.integer "taggings_count", default: 0
    t.index ["name"], name: "index_tags_on_name", unique: true
  end

  create_table "trading_signal_notifications", force: :cascade do |t|
    t.string "external_id"
    t.bigint "trading_signal_id"
    t.string "trading_signal_external_id"
    t.bigint "user_id"
    t.jsonb "extra"
    t.datetime "timestamp"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["external_id"], name: "index_trading_signal_notifications_on_external_id"
    t.index ["trading_signal_external_id"], name: "index_tsn_on_trading_signal_external_id"
    t.index ["trading_signal_id"], name: "index_trading_signal_notifications_on_trading_signal_id"
    t.index ["user_id"], name: "index_trading_signal_notifications_on_user_id"
  end

  create_table "trading_signal_triggers", force: :cascade do |t|
    t.string "external_id"
    t.string "type_key"
    t.jsonb "params"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["external_id"], name: "index_trading_signal_triggers_on_external_id"
    t.index ["type_key"], name: "index_trading_signal_triggers_on_type_key"
  end

  create_table "trading_signals", force: :cascade do |t|
    t.string "external_id"
    t.bigint "trading_signal_trigger_id"
    t.string "trading_signal_trigger_external_id"
    t.jsonb "extra"
    t.datetime "timestamp"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["external_id"], name: "index_trading_signals_on_external_id"
    t.index ["trading_signal_trigger_external_id"], name: "index_ts_on_trading_signal_trigger_external_id"
    t.index ["trading_signal_trigger_id"], name: "index_trading_signals_on_trading_signal_trigger_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "provider"
    t.string "uid"
    t.jsonb "token_sale"
    t.string "username"
    t.string "role"
    t.string "default_currency"
    t.index "((token_sale ->> 'signals_telegram_bot_chat_id'::text))", name: "index_users_on_token_sale_signals_telegram_bot_chat_id"
    t.index "((token_sale ->> 'telegram_username'::text)) gin_trgm_ops", name: "index_users_on_token_sale_telegram_username", using: :gin
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["provider"], name: "index_users_on_provider"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid"], name: "index_users_on_uid"
    t.index ["username"], name: "index_users_on_username"
  end

  create_table "watchlist_items", force: :cascade do |t|
    t.bigint "watchlist_id", null: false
    t.bigint "coin_id", null: false
    t.integer "position", default: 0
    t.index ["coin_id"], name: "index_watchlist_items_on_coin_id"
    t.index ["watchlist_id"], name: "index_watchlist_items_on_watchlist_id"
  end

  create_table "watchlists", force: :cascade do |t|
    t.bigint "user_id"
    t.index ["user_id"], name: "index_watchlists_on_user_id"
  end

  add_foreign_key "articles", "coins"
  add_foreign_key "author_profiles", "users"
  add_foreign_key "calendar_event_categorizations", "calendar_events"
  add_foreign_key "calendar_event_categorizations", "news_categories"
  add_foreign_key "calendar_event_coins", "calendar_events"
  add_foreign_key "calendar_event_coins", "coins"
  add_foreign_key "calendar_events", "users"
  add_foreign_key "coin_excluded_countries", "coins", on_delete: :cascade
  add_foreign_key "coin_excluded_countries", "countries", on_delete: :cascade
  add_foreign_key "coin_industries_coins", "coin_industries"
  add_foreign_key "coin_industries_coins", "coins"
  add_foreign_key "contributor_submissions", "submission_categories"
  add_foreign_key "contributor_submissions", "users", on_delete: :cascade
  add_foreign_key "exchange_listings", "coins", column: "base_symbol_id"
  add_foreign_key "exchange_listings", "coins", column: "quote_symbol_id"
  add_foreign_key "exchange_listings", "exchanges"
  add_foreign_key "feed_sources", "coins"
  add_foreign_key "influencer_reviews", "coins", on_delete: :cascade
  add_foreign_key "influencer_reviews", "influencers", on_delete: :cascade
  add_foreign_key "news_coin_mentions", "coins"
  add_foreign_key "news_coin_mentions", "news_items"
  add_foreign_key "news_item_categorizations", "news_categories"
  add_foreign_key "news_item_categorizations", "news_items"
  add_foreign_key "news_items", "feed_sources"
  add_foreign_key "news_items", "users"
  add_foreign_key "signals_telegram_subscriptions", "coins"
  add_foreign_key "signals_telegram_subscriptions", "signals_telegram_users"
  add_foreign_key "signals_telegram_users", "users"
  add_foreign_key "staked_cofi_transactions", "users"
  add_foreign_key "trading_signal_notifications", "trading_signals"
  add_foreign_key "trading_signal_notifications", "users"
  add_foreign_key "trading_signals", "trading_signal_triggers"
  add_foreign_key "watchlist_items", "coins"
  add_foreign_key "watchlist_items", "watchlists"
  add_foreign_key "watchlists", "users"
end
