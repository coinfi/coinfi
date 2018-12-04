require "administrate/base_dashboard"

class TradingSignalTriggerDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    trading_signals: Field::HasMany,
    id: Field::Number,
    external_id: Field::String,
    type_key: Field::String,
    params: Field::String.with_options(searchable: false),
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
    :external_id,
    :type_key,
    :params,
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :trading_signals,
    :id,
    :external_id,
    :type_key,
    :params,
    :created_at,
    :updated_at,
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [
    :external_id,
    :type_key,
    :params,
  ].freeze

  # Overwrite this method to customize how trading signal triggers are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(trading_signal_trigger)
  #   "TradingSignalTrigger ##{trading_signal_trigger.id}"
  # end
end
