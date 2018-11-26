class TradingSignal < ApplicationRecord
  belongs_to :trading_signal_trigger

  validates :external_id, uniqueness: true
end
