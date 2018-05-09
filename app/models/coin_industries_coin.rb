class CoinIndustriesCoin < ApplicationRecord
  belongs_to :coin
  belongs_to :coin_industry
end