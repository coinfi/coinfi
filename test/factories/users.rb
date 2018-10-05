FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password" }

    # Generally automatically created in user controllers as part of normal signup process
    after(:create) do |user, evaluator|
      create(:watchlist, user: user)
    end
  end
end
