require 'faker'

FactoryBot.define do
  factory :trading_signal_notification do
    user
    trading_signal
    external_id { "0x#{Faker::Crypto.sha256}" }
    trading_signal_external_id { trading_signal ? trading_signal.external_id : "0x#{Faker::Crypto.sha256}" }
    timestamp { 1.minute.ago }

    factory :telegram_trading_signal_notification do
      transient do
        telegram_chat_id { Faker::Number.number(digits: 9) }
      end

      extra {
        {
          "telegram" => {
            "message" => {
              "chat_id" => telegram_chat_id,
              "text" => Faker::Markdown.emphasis,
              "parse_mode" => 'Markdown',
              "disable_web_page_preview" => true,
            }
          }
        }
      }
    end
  end
end
