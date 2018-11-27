require 'faker'

FactoryBot.define do
  factory :trading_signal_notification do
    user
    trading_signal
    external_id { "0x#{Faker::Crypto.sha256}" }
    trading_signal_external_id { "0x#{Faker::Crypto.sha256}" }
    timestamp { 1.minute.ago }
  end
end
