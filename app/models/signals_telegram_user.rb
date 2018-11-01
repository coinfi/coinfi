class SignalsTelegramUser < ApplicationRecord
  belongs_to :user, optional: true
  has_many :signals_telegram_subscriptions

  scope :active, -> { where(is_active: true)}
  scope :inactive, -> { where(is_active: false)}
end
