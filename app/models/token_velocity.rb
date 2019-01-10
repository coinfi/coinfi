class TokenVelocity < ApplicationRecord
  self.table_name = 'token_velocity_view'
  self.primary_key = 'coin_key'
  has_one :coin, foreign_key: :coin_key

  def readonly?
    true
  end
end