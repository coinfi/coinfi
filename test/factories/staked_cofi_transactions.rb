require 'faker'

FactoryBot.define do
  factory :staked_cofi_transaction do
    sequence(:txn_block_number)
    txn_timestamp { "1538563239" }
    txn_hash { "0x#{Faker::Crypto.sha256}" }
    txn_block_hash { "0x#{Faker::Crypto.sha256}" }
    txn_from {
      user&.token_sale&.fetch('staked_ethereum_address', nil) || "0x#{Faker::Crypto.sha1}"
    }
    txn_to { "0x#{Faker::Crypto.sha1}" }
    txn_value { Faker::Number.between(from: 1 * 10 ** 18, to: 10000 * 10 ** 18) }
    txn_token_decimal { 18 }
    is_txn_confirmations_gte_10 { Faker::Boolean.boolean }
  end
end
