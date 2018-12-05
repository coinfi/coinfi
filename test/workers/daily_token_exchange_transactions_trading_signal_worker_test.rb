require 'test_helper'
require "google/cloud/pubsub"

class DailyTokenExchangeTransactionsTradingSignalWorkerTest < ActiveJob::TestCase
  test 'correct trading signal is published' do
    included_trading_signals = 3.times.map do
      timestamp = Faker::Time.between(23.hours.ago, 5.minutes.ago, :between)
      create(:token_exchange_transactions_trading_signal, timestamp: timestamp)
    end
    excluded_trading_signals = 3.times.map do
      timestamp = Faker::Time.between(5.days.ago, 25.hours.ago, :between)
      create(:token_exchange_transactions_trading_signal, timestamp: timestamp)
    end

    # Mock topic
    mocked_topic = Minitest::Mock.new
    mocked_topic.expect(:publish, nil) do |actual_message|
      assert_match /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/, actual_message["timestamp"]
      assert_match /0x[0-9a-f]{40}/, actual_message["external_id"]
      assert_equal actual_message["extra"]["token_transfers"].length, 3
      assert_equal actual_message.except("timestamp", "external_id"), {
        "extra" => {
          "token_transfers" => included_trading_signals.map {|ts| ts.extra["token_transfer"]}
        },
        "schema_version" => "2018-11-08-00-00-00",
        "trading_signal_trigger" => {
          "params" => nil,
          "external_id" => "daily-token-exchange-transactions",
          "type_key" => "daily-token-exchange-transactions"
        }
      }
    end

    # Mock pubsub
    mocked_pubsub = Minitest::Mock.new
    mocked_pubsub.expect :topic, mocked_topic, [String]

    # Stub Google::Cloud::Pubsub.new
    Google::Cloud::Pubsub.stub :new, mocked_pubsub do
      DailyTokenExchangeTransactionsTradingSignalWorker.new.perform()
    end

    assert_mock mocked_pubsub
    assert_mock mocked_topic
  end
end