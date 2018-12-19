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

  test "bulk upsert by external id" do
    existing_trading_signal_triggers = create_list(:trading_signal_trigger, 5)

    # Generate attributes for creates
    new_trading_signal_triggers_attrs = attributes_for_list(:trading_signal_trigger, 5)
    # Generate attributes for updates
    updated_trading_signal_triggers_attrs = existing_trading_signal_triggers.map do |t|
      t_attrs = t.attributes.symbolize_keys.except(:id, :updated_at, :created_at)
      t_attrs.merge(attributes_for(:trading_signal_trigger).except(:external_id))
    end

    request_params_creates = new_trading_signal_triggers_attrs.index_by {|t_attrs| t_attrs.fetch(:external_id)}
    request_params_updates = updated_trading_signal_triggers_attrs.index_by {|t_attrs| t_attrs.fetch(:external_id)}
    request_params = {
      trading_signal_triggers: request_params_creates.merge(request_params_updates)
    }

    assert_difference 'TradingSignalTrigger.count', 5 do
      post "/api/signals/trading_signal_triggers/bulk_upsert_by_external_id",
        params: request_params,
        headers: auth_headers,
        as: :json
      assert_equal 200, status
    end

    # Check record creates are applied
    new_trading_signal_triggers_attrs.each do |t_attrs|
      assert_not_nil created_trading_signal_trigger = TradingSignalTrigger.find_by(external_id: t_attrs[:external_id])
      assert_equal(
        t_attrs.as_json,
        created_trading_signal_trigger.attributes.except('id', 'updated_at', 'created_at')
      )
    end\
    # Check record updates are applied
    updated_trading_signal_triggers_attrs.each_with_index do |t_attrs, i|
      existing_trading_signal_triggers[i].reload
      assert_equal(
        t_attrs.as_json,
        existing_trading_signal_triggers[i].attributes.except('id', 'updated_at', 'created_at')
      )
    end
  end
end
