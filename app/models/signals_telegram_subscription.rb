class SignalsTelegramSubscription < ApplicationRecord
  belongs_to :signals_telegram_user
  belongs_to :coin
end
