class TradingSignalTrigger < ApplicationRecord
  has_many :trading_signals

  validates :type_key, presence: true
end
