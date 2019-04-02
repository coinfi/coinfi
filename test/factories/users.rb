FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password" }
    confirmed_at { DateTime.now }
    token_sale {{}}

    trait :unverified do
      confirmed_at { nil }
      password { "" }
      encrypted_password { "" }
    end

    trait :with_token_sale do
      after(:build) do |user, evaluator|
        user.token_sale = { 'staked_ethereum_address' => '0xABCDEF' }
      end
    end

    trait :with_staked_cofi do
      transient do
        staked_cofi_amount { 20000 }
      end

      staked_cofi_transactions {
        build_list(:staked_cofi_transaction, 1,
          txn_value: staked_cofi_amount * 10 ** 18,
          is_txn_confirmations_gte_10: true
        )
      }
    end

    trait :with_started_signals_reservation do
      after(:build) do |user, evaluator|
        user.token_sale = user.token_sale.merge({
          'signals_reservation_start_time' => 3.days.ago,
          'signals_signup' => true,
          'telegram_username' => Faker::Internet.username,
          'staked_ethereum_address' => "0x#{Faker::Crypto.sha1}",
        })
      end
    end

    trait :with_completed_signals_reservation do
      with_started_signals_reservation

      after(:build) do |user, evaluator|
        user.token_sale = user.token_sale.merge({
          'reservation_completed_at' => 2.days.ago,
        })
      end
    end

    trait :with_transferred_signals_reservation do
      with_completed_signals_reservation
      with_staked_cofi
    end

    trait :with_confirmed_signals_reservation do
      with_transferred_signals_reservation

      after(:build) do |user, evaluator|
        user.token_sale = user.token_sale.merge({
          'reservation_confirmed_at' => 1.days.ago,
        })
      end
    end
  end
end
