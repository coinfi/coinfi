require "administrate/base_dashboard"

class ExchangeCategoryDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    id: Field::Number,
    name: Field::String,
    slug: Field::String.with_options(searchable: false),
    author: Field::BelongsTo.with_options(
      searchable: true,
      searchable_field: 'name',
    ),
    exchange_review_categorizations: Field::HasMany.with_options(limit: 10, sort_by: :ranking),
    exchange_reviews: Field::HasMany.with_options(limit: 10),
    h1: Field::String,
    meta_title: Field::String,
    meta_description: Field::String,
    summary: Field::Text,
    content: MarkdownField,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = %i[
    name
    h1
    author
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = %i[
    id
    name
    slug
    exchange_review_categorizations
    exchange_reviews
    author
    h1
    meta_title
    meta_description
    summary
    content
    created_at
    updated_at
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = %i[
    name
    slug
    exchange_reviews
    author
    h1
    meta_title
    meta_description
    summary
    content
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

  def display_resource(category)
    "#{category.name} (best-#{category.slug}-exchanges)"
  end
end
