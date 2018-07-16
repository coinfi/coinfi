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

ActiveRecord::Schema.define(version: 20180715114637) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "pg_stat_statements"

  create_table "ahoy_events", force: :cascade do |t|
    t.integer "visit_id"
    t.integer "user_id"
    t.string "name"
    t.jsonb "properties"
    t.datetime "time"
    t.index ["name", "time"], name: "index_ahoy_events_on_name_and_time"
    t.index ["user_id", "name"], name: "index_ahoy_events_on_user_id_and_name"
    t.index ["visit_id", "name"], name: "index_ahoy_events_on_visit_id_and_name"
  end

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
    t.index ["importance"], name: "index_articles_on_importance"
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
    t.index ["query_id"], name: "index_blazer_audits_on_query_id"
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
    t.index ["creator_id"], name: "index_blazer_checks_on_creator_id"
    t.index ["query_id"], name: "index_blazer_checks_on_query_id"
  end

  create_table "blazer_dashboard_queries", force: :cascade do |t|
    t.bigint "dashboard_id"
    t.bigint "query_id"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["dashboard_id"], name: "index_blazer_dashboard_queries_on_dashboard_id"
    t.index ["query_id"], name: "index_blazer_dashboard_queries_on_query_id"
  end

  create_table "blazer_dashboards", force: :cascade do |t|
    t.bigint "creator_id"
    t.text "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_blazer_dashboards_on_creator_id"
  end

  create_table "blazer_queries", force: :cascade do |t|
    t.bigint "creator_id"
    t.string "name"
    t.text "description"
    t.text "statement"
    t.string "data_source"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_blazer_queries_on_creator_id"
  end

  create_table "calendar_event_categorizations", force: :cascade do |t|
    t.bigint "event_id"
    t.bigint "news_category_id"
    t.index ["event_id"], name: "index_calendar_event_categorizations_on_event_id"
    t.index ["news_category_id"], name: "index_calendar_event_categorizations_on_news_category_id"
  end

  create_table "calendar_events", force: :cascade do |t|
    t.bigint "coin_id"
    t.bigint "user_id"
    t.string "name"
    t.text "description"
    t.datetime "date_event"
    t.datetime "date_added"
    t.string "source"
    t.string "status"
    t.bigint "approvals"
    t.bigint "disapprovals"
    t.integer "confidence"
    t.index ["coin_id"], name: "index_calendar_events_on_coin_id"
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
    t.decimal "ico_token_price_usd", precision: 10, scale: 2
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
    t.string "website_domain"
    t.index ["category"], name: "index_coins_on_category"
    t.index ["influencer_reviews_count"], name: "index_coins_on_influencer_reviews_count"
    t.index ["market_cap"], name: "index_coins_on_market_cap", using: :gin
    t.index ["name"], name: "index_coins_on_name", unique: true
    t.index ["price"], name: "index_coins_on_price", using: :gin
    t.index ["slug"], name: "index_coins_on_slug"
    t.index ["volume24"], name: "index_coins_on_volume24", using: :gin
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
    t.index ["submission_category_id"], name: "index_contributor_submissions_on_submission_category_id"
    t.index ["user_id"], name: "index_contributor_submissions_on_user_id"
  end

  create_table "countries", force: :cascade do |t|
    t.string "name"
    t.string "alpha2"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
    t.index ["name"], name: "index_feed_sources_on_name", unique: true
  end

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at"
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_id"
    t.index ["sluggable_type"], name: "index_friendly_id_slugs_on_sluggable_type"
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
  end

  create_table "news_items", force: :cascade do |t|
    t.bigint "feed_source_id", null: false
    t.string "feed_item_id", null: false
    t.string "url", null: false
    t.string "title", null: false
    t.text "summary"
    t.text "content"
    t.string "actor_id", null: false
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
    t.index ["feed_item_published_at"], name: "index_news_items_on_feed_item_published_at"
    t.index ["feed_source_id", "feed_item_id"], name: "index_news_items_on_feed_source_id_and_feed_item_id", unique: true
    t.index ["feed_source_id"], name: "index_news_items_on_feed_source_id"
    t.index ["is_published"], name: "index_news_items_on_is_published"
    t.index ["user_id"], name: "index_news_items_on_user_id"
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
    t.index ["context"], name: "index_taggings_on_context"
    t.index ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
    t.index ["taggable_id", "taggable_type", "context"], name: "index_taggings_on_taggable_id_and_taggable_type_and_context"
    t.index ["taggable_id", "taggable_type", "tagger_id", "context"], name: "taggings_idy"
    t.index ["taggable_id"], name: "index_taggings_on_taggable_id"
    t.index ["taggable_type"], name: "index_taggings_on_taggable_type"
    t.index ["tagger_id", "tagger_type"], name: "index_taggings_on_tagger_id_and_tagger_type"
    t.index ["tagger_id"], name: "index_taggings_on_tagger_id"
  end

  create_table "tags", id: :serial, force: :cascade do |t|
    t.string "name"
    t.integer "taggings_count", default: 0
    t.index ["name"], name: "index_tags_on_name", unique: true
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
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["provider"], name: "index_users_on_provider"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid"], name: "index_users_on_uid"
    t.index ["username"], name: "index_users_on_username"
  end

  create_table "visits", force: :cascade do |t|
    t.string "visit_token"
    t.string "visitor_token"
    t.string "ip"
    t.text "user_agent"
    t.text "referrer"
    t.text "landing_page"
    t.integer "user_id"
    t.string "referring_domain"
    t.string "search_keyword"
    t.string "browser"
    t.string "os"
    t.string "device_type"
    t.integer "screen_height"
    t.integer "screen_width"
    t.string "country"
    t.string "region"
    t.string "city"
    t.string "postal_code"
    t.decimal "latitude"
    t.decimal "longitude"
    t.string "utm_source"
    t.string "utm_medium"
    t.string "utm_term"
    t.string "utm_content"
    t.string "utm_campaign"
    t.datetime "started_at"
    t.index ["user_id"], name: "index_visits_on_user_id"
    t.index ["visit_token"], name: "index_visits_on_visit_token", unique: true
  end

  create_table "watchlist_items", force: :cascade do |t|
    t.bigint "watchlist_id", null: false
    t.bigint "coin_id", null: false
    t.integer "position", default: 0
    t.index ["coin_id"], name: "index_watchlist_items_on_coin_id"
    t.index ["position"], name: "index_watchlist_items_on_position"
    t.index ["watchlist_id"], name: "index_watchlist_items_on_watchlist_id"
  end

  create_table "watchlists", force: :cascade do |t|
    t.bigint "user_id"
    t.index ["user_id"], name: "index_watchlists_on_user_id"
  end

  add_foreign_key "articles", "coins"
  add_foreign_key "coin_excluded_countries", "coins", on_delete: :cascade
  add_foreign_key "coin_excluded_countries", "countries", on_delete: :cascade
  add_foreign_key "contributor_submissions", "submission_categories"
  add_foreign_key "contributor_submissions", "users", on_delete: :cascade
  add_foreign_key "feed_sources", "coins"
  add_foreign_key "influencer_reviews", "coins", on_delete: :cascade
  add_foreign_key "influencer_reviews", "influencers", on_delete: :cascade
  add_foreign_key "news_items", "users"
end
