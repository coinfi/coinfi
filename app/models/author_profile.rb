class AuthorProfile < ApplicationRecord

  belongs_to :user, inverse_of: :author_profile
  accepts_nested_attributes_for :user

  def username
    user.username
  end

  private

end