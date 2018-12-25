class Metric < ApplicationRecord
  belongs_to :coin, foreign_key: :token_address, optional: true
end