require 'faker'

FactoryBot.define do
  factory :trading_signal do
    trading_signal_trigger
    external_id { "0x#{Faker::Crypto.sha256}" }
    timestamp { 5.minutes.ago }
    extra { {} }

    factory :telegram_trading_signal do
      transient do
        telegram_chat_id { Faker::Number.number(9) }
      end

      extra {
        {
          "telegram": {
            "message": {
              "chat_id": telegram_chat_id,
              "text": Faker::Markdown.emphasis,
              "parse_mode": 'Markdown',
              "disable_web_page_preview": true,
            }
          }
        }
      }
    end
  end
end
