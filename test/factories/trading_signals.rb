require 'faker'

FactoryBot.define do
  factory :trading_signal do
    trading_signal_trigger
    external_id { "0x#{Faker::Crypto.sha256}" }
    trading_signal_trigger_external_id { trading_signal_trigger ? trading_signal_trigger.external_id : "0x#{Faker::Crypto.sha256}" }
    timestamp { 5.minutes.ago }
    extra { {} }
  end
end
