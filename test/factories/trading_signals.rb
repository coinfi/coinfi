require 'faker'

FactoryBot.define do
  factory :trading_signal do
    trading_signal_trigger
    external_id { "0x#{Faker::Crypto.sha256}" }
    trading_signal_trigger_external_id { trading_signal_trigger ? trading_signal_trigger.external_id : "0x#{Faker::Crypto.sha256}" }
    timestamp { 5.minutes.ago }
    extra { {} }

    factory :token_exchange_transactions_trading_signal do
      extra {
        {
          "token_transfer" => {
            "type" => "token_transfer",
            "value" => 4455000000,
            "coin_key" => "adex.network",
            "log_index" => 42,
            "block_hash" => "0x6edf7bf559a06e383c1ddbad1f069205834b289fa938760cbd0ab470af5b04f7",
            "to_address" => "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be",
            "block_number" => 6805400,
            "from_address" => "0xc799802696873613d44b58bb3b681f42cf491aab",
            "token_address" => "0x4470bb87d77b963a013db939be332f927f2b992e",
            "block_timestamp" => 1543652509,
            "to_address_name" => "Binance",
            "to_address_type" => "Exchange",
            "transaction_hash" => "0x69806a1c1a2e2fa04b01065f1539fd01344884854e83b70cdf72e0546dfc0bdb",
            "from_address_name" => nil,
            "from_address_type" => nil
          }
        }
      }
    end
  end
end
