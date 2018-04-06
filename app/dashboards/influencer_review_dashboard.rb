require "administrate/base_dashboard"

class InfluencerReviewDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    coin: Field::BelongsTo,
    influencer: Field::BelongsTo,
    id: Field::Number,
    url: Field::String,
    rating: Field::String,
    review: Field::Text,
    review_date: Field::DateTime,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = [
    :coin,
    :review_date,
    :influencer,
    :id,
    :url,
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :coin,
    :influencer,
    :id,
    :url,
    :rating,
    :review_date,
    :review,
    :created_at,
    :updated_at,
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [
    :coin,
    :influencer,
    :url,
    :rating,
    :review_date,
    :review,
  ].freeze

  # Overwrite this method to customize how influencer reviews are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(influencer_review)
  #   "InfluencerReview ##{influencer_review.id}"
  # end
end
