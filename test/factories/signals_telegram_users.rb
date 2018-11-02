require 'faker'

FactoryBot.define do
  factory :signals_telegram_user do
    user
    telegram_username { Faker::Internet.username(nil, %w(_)) }
    telegram_chat_id { Faker::Number.number(9) }
    started_at { 1.day.ago }
    is_active { true }

    trait :with_signals_telegram_subscriptions do
      transient do
        signals_telegram_subscription_count { 3 }
      end

      signals_telegram_subscriptions {
        create_list(:signals_telegram_subscription, signals_telegram_subscription_count)
      }
    end
  end
end
