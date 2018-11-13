class SignalsTelegramUser < ApplicationRecord
  belongs_to :user, optional: true
  has_many :signals_telegram_subscriptions
  has_many :subscribed_coins, through: :signals_telegram_subscriptions, source: :coin

  scope :active, -> { where(is_active: true)}
  scope :inactive, -> { where(is_active: false)}
end
