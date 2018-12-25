class TokenSupply < ApplicationRecord
  self.table_name = 'exchange_supply_view'
  self.primary_key = 'coin_key'
  has_one :coin, foreign_key: :coin_key
end