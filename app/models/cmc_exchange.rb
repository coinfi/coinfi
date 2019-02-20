class CmcExchange < ApplicationRecord
  upsert_keys :cmc_id
end
