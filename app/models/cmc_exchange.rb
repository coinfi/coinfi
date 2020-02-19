class CmcExchange < ApplicationRecord
  upsert_keys :cmc_id
  has_one :exchange_review
end
