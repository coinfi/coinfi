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

ActiveRecord::Schema.define(version: 20180330075054) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "pg_stat_statements"

  create_table "ahoy_events", id: false, force: :cascade do |t|
    t.bigserial "id", null: false
    t.integer "visit_id"
    t.integer "user_id"
    t.string "name"
    t.jsonb "properties"
    t.datetime "time"
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

  create_table "blazer_audits", id: false, force: :cascade do |t|
    t.bigserial "id", null: false
    t.bigint "user_id"
    t.bigint "query_id"
    t.text "statement"
    t.string "data_source"
    t.datetime "created_at"
  end

  create_table "blazer_checks", id: false, force: :cascade do |t|
    t.bigserial "id", null: false
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
  end

  create_table "blazer_dashboard_queries", id: false, force: :cascade do |t|
    t.bigserial "id", null: false
    t.bigint "dashboard_id"
    t.bigint "query_id"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "blazer_dashboards", id: false, force: :cascade do |t|
    t.bigserial "id", null: false
    t.bigint "creator_id"
    t.text "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "blazer_queries", id: false, force: :cascade do |t|
    t.bigserial "id", null: false
    t.bigint "creator_id"
    t.string "name"
    t.text "description"
    t.text "statement"
    t.string "data_source"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "coins", force: :cascade do |t|
    t.string "name", null: false
    t.string "symbol", null: false
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
    t.bigint "ico_start_date"
    t.bigint "ico_end_date"
    t.decimal "ico_token_price_usd", precision: 10, scale: 2
    t.decimal "ico_token_price_btc", precision: 24, scale: 16
    t.decimal "ico_token_price_eth", precision: 24, scale: 16
    t.decimal "ico_personal_cap_usd_min", precision: 10, scale: 2
    t.decimal "ico_personal_cap_usd_max", precision: 10, scale: 2
    t.decimal "ico_fundraising_goal_usd", precision: 18, scale: 2
    t.decimal "ico_fundraising_goal_eth", precision: 24, scale: 16
    t.decimal "ico_fundraising_status_usd", precision: 18, scale: 2
    t.decimal "ico_fundraising_status_eth", precision: 24, scale: 16
    t.decimal "ico_tokens_sold", precision: 32, scale: 16
    t.float "ico_returns_usd"
    t.float "ico_returns_btc"
    t.float "ico_returns_eth"
    t.jsonb "influencer"
    t.jsonb "excluded_countries", array: true
    t.string "blockchain_tech"
    t.string "token_type"
    t.jsonb "exchanges", array: true
  end

  create_table "coins_watchlists", id: false, force: :cascade do |t|
    t.bigint "watchlist_id", null: false
    t.bigint "coin_id", null: false
    t.index ["coin_id"], name: "index_coins_watchlists_on_coin_id"
    t.index ["watchlist_id"], name: "index_coins_watchlists_on_watchlist_id"
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

  create_table "daily_prices", force: :cascade do |t|
    t.bigint "coin_id"
    t.date "date"
    t.bigint "timestamp"
    t.bigint "supply"
    t.jsonb "price"
    t.jsonb "volume24"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "friendly_id_slugs", id: false, force: :cascade do |t|
    t.bigserial "id", null: false
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at"
  end

  create_table "histo_hours", id: false, force: :cascade do |t|
    t.bigserial "id", null: false
    t.string "from_symbol"
    t.string "to_symbol"
    t.integer "time"
    t.decimal "close"
    t.decimal "high"
    t.decimal "low"
    t.decimal "open"
    t.decimal "volumefrom"
    t.decimal "volumeto"
  end

  create_table "hourly_prices", id: false, force: :cascade do |t|
    t.bigserial "id", null: false
    t.bigint "coin_id"
    t.datetime "datetime"
    t.bigint "timestamp"
    t.bigint "supply"
    t.jsonb "price"
    t.jsonb "volume24"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
  end

  create_table "tags", id: :serial, force: :cascade do |t|
    t.string "name"
    t.integer "taggings_count", default: 0
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
  end

  create_table "watchlists", force: :cascade do |t|
    t.bigint "user_id"
    t.index ["user_id"], name: "index_watchlists_on_user_id"
  end

  add_foreign_key "contributor_submissions", "submission_categories"
  add_foreign_key "contributor_submissions", "users", on_delete: :cascade
end
