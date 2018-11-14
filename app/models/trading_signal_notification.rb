class TradingSignalNotification < ApplicationRecord
  belongs_to :user
  belongs_to :trading_signal
end
