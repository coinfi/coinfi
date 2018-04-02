class Country < ApplicationRecord
  has_many :coin_excluded_countries
  has_many :coins, through: :coin_excluded_countries
end
