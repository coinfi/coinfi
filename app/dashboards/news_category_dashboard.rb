require "administrate/base_dashboard"

class NewsCategoryDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    news_item_categorizations: Field::HasMany,
    news_items: Field::HasMany,
    id: Field::Number,
    name: Field::String,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = [
    :news_item_categorizations,
    :news_items,
    :id,
    :name,
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :news_item_categorizations,
    :news_items,
    :id,
    :name,
    :created_at,
    :updated_at,
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [
    :news_item_categorizations,
    :news_items,
    :name,
  ].freeze

  # Overwrite this method to customize how news categories are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(news_category)
  #   "NewsCategory ##{news_category.id}"
  # end
  #
  def display_resource(category)
    category.name
  end
end
