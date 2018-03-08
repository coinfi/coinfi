class AuthorProfile < ApplicationRecord

  extend FriendlyId
  friendly_id :name, use: [:slugged]

  belongs_to :user, inverse_of: :author_profile
  accepts_nested_attributes_for :user

  validates :name, presence: true, length: { minimum: 3 }

  def username
    user.username
  end

  private

end