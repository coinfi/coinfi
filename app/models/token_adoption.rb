class TokenAdoption < ApplicationRecord
  self.table_name = 'unique_wallet_count_view'
  self.primary_key = 'coin_key'
  has_one :coin, foreign_key: :coin_key
end