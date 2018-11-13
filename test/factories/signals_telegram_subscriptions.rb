require 'faker'

FactoryBot.define do
  factory :signals_telegram_subscription do
    signals_telegram_user
    coin
  end
end
