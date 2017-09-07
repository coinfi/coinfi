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

ActiveRecord::Schema.define(version: 20170905155512) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

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
    t.index ["category"], name: "index_coins_on_category"
    t.index ["market_cap"], name: "index_coins_on_market_cap", using: :gin
    t.index ["price"], name: "index_coins_on_price", using: :gin
    t.index ["slug"], name: "index_coins_on_slug"
    t.index ["volume24"], name: "index_coins_on_volume24", using: :gin
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
    t.index ["coin_id", "date"], name: "index_daily_prices_on_coin_id_and_date", unique: true
    t.index ["coin_id"], name: "index_daily_prices_on_coin_id"
    t.index ["date"], name: "index_daily_prices_on_date"
    t.index ["price"], name: "index_daily_prices_on_price", using: :gin
    t.index ["volume24"], name: "index_daily_prices_on_volume24", using: :gin
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

  add_foreign_key "articles", "coins"
  add_foreign_key "daily_prices", "coins"
end
