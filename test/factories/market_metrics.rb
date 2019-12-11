require 'faker'

FactoryBot.define do
  factory :market_metric do
    total_market_cap { Faker::Number.decimal(12, 2) }
    total_volume_24h { Faker::Number.decimal(11, 2) }
    sequence(:timestamp) { |n| Faker::Time.backward(n) }
  end
end