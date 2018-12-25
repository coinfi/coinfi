require 'application_integration_test'
require 'test_helper'
require_relative './base_test'

class Api::Signals::TradingSignalsTest < Api::Signals::BaseTest
  test "show" do
    trading_signals = create_list(:trading_signal, 3)
    trading_signal = trading_signals.sample

    get "/api/signals/trading_signals/#{trading_signal.id}", headers: auth_headers
    assert_equal 200, status
    assert_equal(
      trading_signal.attributes.except("updated_at", "created_at").as_json,
      response.parsed_body
    )
  end

  test "create" do
    trading_signal_trigger = create(:trading_signal_trigger)
    trading_signal_attrs = build(:trading_signal, trading_signal_trigger: trading_signal_trigger).attributes
    request_params = {
      trading_signal: trading_signal_attrs
    }

    assert_difference 'TradingSignal.count', 1 do
      post "/api/signals/trading_signals", params: request_params, headers: auth_headers, as: :json
    end
    assert_equal 201, status
    assert_equal(
      trading_signal_attrs.except("id", "updated_at", "created_at").as_json,
      response.parsed_body.except("id")
    )
  end
end
