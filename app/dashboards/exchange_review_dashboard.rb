require "administrate/base_dashboard"

class ExchangeReviewDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    id: Field::Number,
    cmc_exchange: Field::BelongsToSearch.with_options(
      searchable: true,
      searchable_field: 'name',
    ),
    author: Field::BelongsTo.with_options(
      searchable: true,
      searchable_field: 'name',
    ),
    slug: Field::String.with_options(searchable: false),
    h1: Field::String,
    meta_title: Field::String,
    meta_description: Field::String,
    summary: Field::Text,
    content: MarkdownField,
    deposit: Field::Text,
    withdrawal: Field::Text,
    fees: Field::Text,
    available_countries: Field::Text,
    payment_methods: Field::Text,
    fees_rating: Field::Number,
    ease_of_use_rating: Field::Number,
    security_rating: Field::Number,
    support_rating: Field::Number,
    selection_rating: Field::Number,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = %i[
    cmc_exchange
    h1
    author
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = %i[
    id
    slug
    cmc_exchange
    author
    h1
    meta_title
    meta_description
    summary
    content
    deposit
    withdrawal
    fees
    available_countries
    payment_methods
    fees_rating
    ease_of_use_rating
    security_rating
    support_rating
    selection_rating
    created_at
    updated_at
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = %i[
    slug
    cmc_exchange
    author
    h1
    meta_title
    meta_description
    summary
    content
    deposit
    withdrawal
    fees
    available_countries
    payment_methods
    fees_rating
    ease_of_use_rating
    security_rating
    support_rating
    selection_rating
  ].freeze

  # COLLECTION_FILTERS
  # a hash that defines filters that can be used while searching via the search
  # field of the dashboard.
  #
  # For example to add an option to search for open resources by typing "open:"
  # in the search field:
  #
  #   COLLECTION_FILTERS = {
  #     open: ->(resources) { resources.where(open: true) }
  #   }.freeze
  COLLECTION_FILTERS = {}.freeze

  def display_resource(review)
    "#{review.cmc_exchange.name} Review"
  end
end
