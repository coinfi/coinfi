class SignalsTelegramUser < ApplicationRecord
  belongs_to :user, optional: true
  has_many :signals_telegram_subscriptions
end
