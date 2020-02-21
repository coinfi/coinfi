require 'faker'

FactoryBot.define do
  factory :trading_signal_trigger do
    external_id { "0x#{Faker::Crypto.sha256}" }
    type_key { Faker::Lorem.words(number: 3).join('.') }
    params {
      {
        "count_threshold": 2,
        "amount_threshold": 200000,
      }
    }
  end
end
