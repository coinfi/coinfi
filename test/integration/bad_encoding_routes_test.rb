require 'application_integration_test'
require 'test_helper'

class BadEncodingRoutesTest < ApplicationIntegrationTest
  test "can visit index with valid query string" do
    get "#{root_url}?q=valid"
    assert_equal 200, status
  end

  test "can visit index with no query string" do
    get root_url
    assert_equal 200, status
  end

  # Invalid query string cannot be tested here
  # It appears to return an error from the "get" method before hitting middleware
end
