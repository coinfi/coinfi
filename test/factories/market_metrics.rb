require 'faker'

FactoryBot.define do
  factory :market_metric do
    total_market_cap { Faker::Number.decimal(l_digits: 12, r_digits: 2) }
    total_volume_24h { Faker::Number.decimal(l_digits: 11, r_digits: 2) }
    sequence(:timestamp) { |n| Faker::Time.backward(days: n) }
  end
end