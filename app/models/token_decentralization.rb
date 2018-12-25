class TokenDecentralization < ApplicationRecord
  self.table_name = 'token_distribution_100_view'
  self.primary_key = 'coin_key'
  has_one :coin, foreign_key: :coin_key
end