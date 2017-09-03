require "administrate/base_dashboard"

class CoinDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    id: Field::Number,
    name: Field::String,
    symbol: Field::String,
    website: Field::String,
    website2: Field::String,
    explorer: Field::String,
    explorer2: Field::String,
    forum: Field::String,
    forum2: Field::String,
    twitter: Field::String,
    reddit: Field::String,
    medium: Field::String,
    github: Field::String,
    whitepaper: Field::String,
    tier: Field::Number,
    release_date: Field::DateTime,
    consensus_method: Field::Text,
    intro: Field::Text,
    summary: Field::Text,
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
    :name,
    :symbol,
    :website,
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :id,
    :name,
    :symbol,
    :website,
    :website2,
    :explorer,
    :explorer2,
    :forum,
    :forum2,
    :twitter,
    :reddit,
    :medium,
    :github,
    :whitepaper,
    :tier,
    :release_date,
    :consensus_method,
    :intro,
    :summary,
    :created_at,
    :updated_at,
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [
    :name,
    :symbol,
    :website,
    :website2,
    :explorer,
    :explorer2,
    :forum,
    :forum2,
    :twitter,
    :reddit,
    :medium,
    :github,
    :whitepaper,
    :tier,
    :release_date,
    :consensus_method,
    :intro,
    :summary,
  ].freeze

  # Overwrite this method to customize how coins are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(coin)
  #   "Coin ##{coin.id}"
  # end
end
