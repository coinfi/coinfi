require "administrate/base_dashboard"

class NewsItemDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    id: Field::Number,
    coins: Field::HasMany,
    news_categories: Field::HasMany,
    feed_item_id: Field::String,
    url: Field::String,
    title: Field::String,
    summary: Field::Text,
    content: Field::Text,
    actor_id: Field::String,
    feed_item_published_at: Field::DateTime,
    feed_item_updated_at: Field::DateTime,
    importance: Field::Number,
    is_published: Field::Boolean,
    is_human_tagged: Field::Boolean,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
    coin_symbols: Field::String,
    news_category_names: Field::String,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = [
    :id,
    :coin_symbols,
    :news_category_names,
    :is_human_tagged,
    :title,
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :id,
    :coin_symbols,
    :feed_item_id,
    :url,
    :title,
    :summary,
    :content,
    :actor_id,
    :feed_item_published_at,
    :feed_item_updated_at,
    :importance,
    :is_published,
    :is_human_tagged,
    :created_at,
    :updated_at,
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [
    :coins,
    :news_categories,
    :is_human_tagged,
    :is_published,
    #:feed_item_id,
    #:url,
    #:title,
    #:summary,
    #:content,
    #:actor_id,
    #:feed_item_published_at,
    #:feed_item_updated_at,
    #:importance,
  ].freeze

  # Overwrite this method to customize how news items are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(news_item)
  #   "NewsItem ##{news_item.id}"
  # end
end
