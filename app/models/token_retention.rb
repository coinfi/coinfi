class TokenRetention < ApplicationRecord
  self.table_name = 'token_retention_rate_view'
  self.primary_key = 'coin_key'
  has_one :coin, foreign_key: :coin_key

  def readonly?
    true
  end
end