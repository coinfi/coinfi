require 'faker'

FactoryBot.define do
  factory :exchange_listing do
    transient do
      base_coin { nil }
      quote_coin { create(:coin) }
    end

    exchange
    quote_symbol { quote_coin.symbol }
    sequence(:base_symbol) { |n| base_coin&.symbol || "USD#{n}" }
    symbol { "#{quote_symbol}/#{base_symbol}" }
    ccxt_exchange_id { exchange.ccxt_id }
    detected_at { Faker::Date.between(2.months.ago, 1.week.ago) }
  end
end
