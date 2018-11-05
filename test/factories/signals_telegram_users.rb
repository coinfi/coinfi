require 'faker'

FactoryBot.define do
  factory :signals_telegram_user do
    user
    telegram_id { Faker::Number.number(9) }
    sequence(:telegram_username) { |n| user.token_sale['telegram_username'] || "#{Faker::Internet.username(nil, %w(_))}_#{n}" }
    telegram_chat_id { Faker::Number.number(9) }
    started_at { 1.day.ago }
    is_active { true }

    # Set the telegram username if not already set
    after(:build) do |signals_telegram_user, evaluator|
      unless signals_telegram_user.user.token_sale['telegram_username']
        signals_telegram_user.user.token_sale['telegram_username'] = signals_telegram_user.telegram_username
      end
    end

    trait :with_signals_telegram_subscriptions do
      transient do
        signals_telegram_subscription_count { 3 }
      end

      signals_telegram_subscriptions {
        build_list(:signals_telegram_subscription, signals_telegram_subscription_count)
      }
    end
  end
end
