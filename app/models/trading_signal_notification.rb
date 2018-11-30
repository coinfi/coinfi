class TradingSignalNotification < ApplicationRecord
  belongs_to :user
  # Set the association trading_signal association as optional because we want to capture all
  # results and not enforce validations even if records were created out of order
  belongs_to :trading_signal, optional: true

  validates :external_id, uniqueness: true
  validates :trading_signal_id, presence: { unless: :trading_signal_external_id? }
  validates :trading_signal_external_id, presence: { unless: :trading_signal_id? }
  validates :timestamp, presence: true
end
