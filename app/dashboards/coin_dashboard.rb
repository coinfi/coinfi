require "administrate/base_dashboard"

class CoinDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    id: Field::Number.with_options(searchable: true),
    ranking: Field::Number,
    name: Field::String,
    symbol: Field::String,
    slug: Field::String.with_options(searchable: false),
    category: Field::String.with_options(searchable: false),
    website: Field::String.with_options(searchable: false),
    website2: Field::String.with_options(searchable: false),
    explorer: Field::String.with_options(searchable: false),
    explorer2: Field::String.with_options(searchable: false),
    forum: Field::String.with_options(searchable: false),
    forum2: Field::String.with_options(searchable: false),
    twitter: Field::String.with_options(searchable: false),
    reddit: Field::String.with_options(searchable: false),
    medium: Field::String.with_options(searchable: false),
    github: Field::String.with_options(searchable: false),
    whitepaper: Field::String.with_options(searchable: false),
    tier: Field::Number,
    description: MarkdownField,
    release_date: Field::DateTime,
    algorithm: Field::Text,
    proof_type: Field::Text,
    image_url: Field::Text,
    is_premined: Field::Boolean,
    intro: Field::Text,
    summary: Field::Text,
    ico_status: Field::String.with_options(searchable: false),
    ico_start_epoch: Field::Number,
    ico_end_epoch: Field::Number,
    ico_start_date: Field::DateTime,
    ico_end_date: Field::DateTime,
    ico_token_price_usd: Field::Number,
    ico_token_price_btc: Field::Number,
    ico_token_price_eth: Field::Number,
    ico_personal_cap_min: Field::String.with_options(searchable: false),
    ico_personal_cap_max: Field::String.with_options(searchable: false),
    ico_fundraising_goal_usd: Field::Number,
    ico_fundraising_goal_eth: Field::Number,
    ico_fundraising_status_usd: Field::Number,
    ico_fundraising_status_eth: Field::Number,
    ico_tokens_sold: Field::Number,
    ico_returns_usd: Field::Number,
    ico_returns_btc: Field::Number,
    ico_returns_eth: Field::Number,
    influencer_reviews: Field::NestedHasMany.with_options(skip: :coin),
    coin_excluded_countries: Field::NestedHasMany.with_options(skip: :coin),
    blockchain_tech: Field::String.with_options(searchable: false),
    token_type: Field::String.with_options(searchable: false),
    exchanges: Field::JSONB,
    previous_name: Field::String,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = [
    :id,
    :ranking,
    :name,
    :symbol,
    :slug,
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :id,
    :name,
    :symbol,
    :slug,
    :previous_name,
    :image_url,
    :category,
    :website,
    #:website2,
    :explorer,
    #:explorer2,
    :forum,
    #:forum2,
    :twitter,
    :reddit,
    :medium,
    :github,
    :whitepaper,
    :tier,
    :description,
    :release_date,
    :algorithm,
    :proof_type,
    :is_premined,
    :intro,
    :summary,
    :ico_status,
    :ico_start_epoch,
    :ico_end_epoch,
    :ico_start_date,
    :ico_end_date,
    :ico_token_price_usd,
    :ico_token_price_btc,
    :ico_token_price_eth,
    :ico_personal_cap_min,
    :ico_personal_cap_max,
    :ico_fundraising_goal_usd,
    :ico_fundraising_goal_eth,
    :ico_fundraising_status_usd,
    :ico_fundraising_status_eth,
    :ico_tokens_sold,
    :ico_returns_usd,
    :ico_returns_btc,
    :ico_returns_eth,
    :blockchain_tech,
    :token_type,
    :exchanges,
    :created_at,
    :updated_at,
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [
    :name,
    :symbol,
    :slug,
    :previous_name,
    :image_url,
    :category,
    :website,
    #:website2,
    :explorer,
    #:explorer2,
    :forum,
    #:forum2,
    :twitter,
    :reddit,
    :medium,
    :github,
    :whitepaper,
    :tier,
    :description,
    :release_date,
    :algorithm,
    :proof_type,
    :is_premined,
    :intro,
    :summary,
    :ico_status,
    :ico_start_epoch,
    :ico_end_epoch,
    :ico_start_date,
    :ico_end_date,
    :ico_token_price_usd,
    :ico_token_price_btc,
    :ico_token_price_eth,
    :ico_personal_cap_min,
    :ico_personal_cap_max,
    :ico_fundraising_goal_usd,
    :ico_fundraising_goal_eth,
    :ico_fundraising_status_usd,
    :ico_fundraising_status_eth,
    :ico_tokens_sold,
    :ico_returns_usd,
    :ico_returns_btc,
    :ico_returns_eth,
    :influencer_reviews,
    :coin_excluded_countries,
    :blockchain_tech,
    :token_type,
    :exchanges
  ].freeze

  COLLECTION_FILTERS = {
    listed: ->(resources) { resources.where(is_listed: true) }
  }.freeze

  # Overwrite this method to customize how coins are displayed
  # across all pages of the admin dashboard.
  #
  def display_resource(coin)
    "#{coin.name} (#{coin.symbol})"
  end
end
