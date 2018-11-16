require 'faker'

FactoryBot.define do
  factory :trading_signal_trigger do
    type_key { Faker::Lorem.words(3).join('.') }
    params {
      {
        "count_threshold": 2,
        "amount_threshold": 200000,
      }
    }
  end
end
