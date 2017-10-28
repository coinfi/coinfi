require "administrate/base_dashboard"

class ArticleDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    id: Field::Number,
    coin: Field::BelongsTo.with_options(class_name: 'Coin', order: 'slug ASC'),
    url: Field::String,
    title: Field::String,
    summary: Field::Text,
    published_date: Field::DateTime,
    importance: Field::String.with_options(searchable: false),
    tag_list: TagListField,
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
    :coin,
    :url,
    :title,
    :published_date,
    :importance,
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :id,
    :coin,
    :url,
    :title,
    :summary,
    :published_date,
    :importance,
    :tag_list,
    :created_at,
    :updated_at,
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [
    :coin,
    :url,
    :title,
    :summary,
    :published_date,
    :importance,
    :tag_list,
  ].freeze

  # Overwrite this method to customize how articles are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(article)
  #   "Article ##{article.id}"
  # end
end
