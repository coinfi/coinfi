class CoinIndustry < ApplicationRecord
  has_many :coin_industries_coins
  has_many :coins, through: :coin_industries_coins
end