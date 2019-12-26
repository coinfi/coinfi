class Author < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged
  has_many :coin_articles
  validates :name, presence: true
end
