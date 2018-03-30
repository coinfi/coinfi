class CoinExcludedCountry < ApplicationRecord
  belongs_to :coin
  belongs_to :country
end
