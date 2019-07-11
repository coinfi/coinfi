require 'application_integration_test'
require 'test_helper'

class SignalsRoutesTest < ApplicationIntegrationTest
  test "can visit index" do
    get "/signals"
    assert_equal 200, status
  end

  test "reservation redirects to index" do
    get "/signals/reservation"
    assert_equal 301, status
  end
end
