require 'application_integration_test'
require 'test_helper'
require_relative './base_test'

class Api::Signals::TradingSignalTriggersTest < Api::Signals::BaseTest
  test "show" do
    trading_signal_triggers = create_list(:trading_signal_trigger, 3)
    trading_signal_trigger = trading_signal_triggers.sample

    get "/api/signals/trading_signal_triggers/#{trading_signal_trigger.id}", headers: auth_headers
    assert_equal 200, status
    assert_equal(
      trading_signal_trigger.attributes.except("updated_at", "created_at"),
      response.parsed_body
    )
  end

  test "create" do
    trading_signal_trigger_attrs = attributes_for(:trading_signal_trigger)
    request_params = {
      trading_signal_trigger: trading_signal_trigger_attrs
    }

    assert_difference 'TradingSignalTrigger.count', 1 do
      post "/api/signals/trading_signal_triggers", params: request_params, headers: auth_headers, as: :json
    end
    assert_equal 201, status
    assert_equal trading_signal_trigger_attrs.as_json, response.parsed_body.except("id")
  end
end
