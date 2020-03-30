class TokenVelocity < ApplicationRecord
  self.primary_key = :coin_key
  has_one :coin, foreign_key: :coin_key

  def self.refresh
    Scenic.database.refresh_materialized_view(table_name, concurrently: true, cascade: false)
  end

  def readonly?
    true
  end
end