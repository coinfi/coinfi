class TradingSignalTrigger < ApplicationRecord
  has_many :trading_signals

  validates :external_id, uniqueness: true
  validates :type_key, presence: true
end
