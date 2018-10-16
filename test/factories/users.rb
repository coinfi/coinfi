FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password" }
    token_sale {{}}

    trait :with_token_sale do
      after(:build) do |user, evaluator|
        user.token_sale = { 'staked_ethereum_address' => '0xABCDEF' }
      end
    end
  end
end
