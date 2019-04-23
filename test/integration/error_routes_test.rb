require 'application_integration_test'
require 'test_helper'

class ErrorRoutesTest < ApplicationIntegrationTest
  test "can visit 404" do
    get "/404"
    assert_equal 404, status
  end

  test "can visit 500" do
    get "/500"
    assert_equal 500, status
  end
end
