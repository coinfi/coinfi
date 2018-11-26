class TradingSignal < ApplicationRecord
  # Set the association trading_signal_trigger association as optional because we want to capture
  # all results and not enforce validations even if records were created out of order
  belongs_to :trading_signal_trigger, optional: true

  validates :external_id, uniqueness: true
  validates :trading_signal_trigger_id, presence: { unless: :trading_signal_trigger_external_id? }
  validates :trading_signal_trigger_external_id, presence: { unless: :trading_signal_trigger_id? }
end
