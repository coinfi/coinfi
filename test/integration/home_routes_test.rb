require 'application_integration_test'
require 'test_helper'

class HomeRoutesTest < ApplicationIntegrationTest
  test "can visit index" do
    get "/"
    assert_equal 200, status
  end
end
