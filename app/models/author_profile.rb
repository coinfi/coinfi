class AuthorProfile < ApplicationRecord

  include Validators

  belongs_to :user, inverse_of: :author_profile
  accepts_nested_attributes_for :user

  validates :name, presence: true, length: { minimum: 3 }
  validates :company, presence: true, length: { minimum: 3 }
  validates :role, presence: true, length: { minimum: 3 }
  validates :bio, presence: true

  def username
    user.username
  end

  private

end