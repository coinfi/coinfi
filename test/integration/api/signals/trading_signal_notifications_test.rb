require 'application_integration_test'
require 'test_helper'
require_relative './base_test'

class Api::Signals::TradingSignalNotificationsTest < Api::Signals::BaseTest
  test "show" do
    trading_signal_notifications = create_list(:telegram_trading_signal_notification, 3)
    trading_signal_notification = trading_signal_notifications.sample

    get "/api/signals/trading_signal_notifications/#{trading_signal_notification.id}", headers: auth_headers
    assert_equal 200, status
    assert_equal(
      trading_signal_notification.attributes.except("updated_at", "created_at").as_json,
      response.parsed_body
    )
  end

  test "create" do
    user = create(:user)
    trading_signal = create(:trading_signal)
    trading_signal_notification_attrs = build(:telegram_trading_signal_notification, user: user, trading_signal: trading_signal).attributes
    request_params = {
      trading_signal_notification: trading_signal_notification_attrs
    }

    assert_difference 'TradingSignalNotification.count', 1 do
      post "/api/signals/trading_signal_notifications", params: request_params, headers: auth_headers, as: :json
    end
    assert_equal 201, status
    assert_equal(
      trading_signal_notification_attrs.except("id", "updated_at", "created_at").as_json,
      response.parsed_body.except("id")
    )
  end
end
