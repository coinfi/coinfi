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
    t.decimal "importance"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["coin_id"], name: "index_articles_on_coin_id"
    t.index ["importance"], name: "index_articles_on_importance"
    t.index ["published_date"], name: "index_articles_on_published_date"
  end

  create_table "coins", force: :cascade do |t|
    t.string "name"
    t.string "symbol"
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
    t.integer "tier"
    t.date "release_date"
    t.text "consensus_method"
    t.text "intro"
    t.text "summary"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
  end

  create_table "daily_prices", force: :cascade do |t|
    t.bigint "coin_id"
    t.date "date"
    t.bigint "timestamp"
    t.bigint "supply"
    t.decimal "usd_price"
    t.decimal "usd_volume"
    t.decimal "btc_price"
    t.decimal "btc_volume"
    t.decimal "eur_price"
    t.decimal "eur_volume"
    t.decimal "cny_price"
    t.decimal "cny_volume"
    t.decimal "gbp_price"
    t.decimal "gbp_volume"
    t.decimal "rub_price"
    t.decimal "rub_volume"
    t.decimal "hkd_price"
    t.decimal "hkd_volume"
    t.decimal "jpy_price"
    t.decimal "jpy_volume"
    t.decimal "aud_price"
    t.decimal "aud_volume"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["coin_id", "date"], name: "index_daily_prices_on_coin_id_and_date", unique: true
    t.index ["coin_id"], name: "index_daily_prices_on_coin_id"
    t.index ["date"], name: "index_daily_prices_on_date"
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
