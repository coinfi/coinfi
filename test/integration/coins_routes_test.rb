require 'application_integration_test'
require 'test_helper'

class CoinsRoutesTest < ApplicationIntegrationTest
  setup do
    initialize_views
    @coins = create_list(:coin_with_metrics, 10)
  end

  teardown do
    teardown_views
  end

  test "can visit index" do
    get "/coins"
    assert_equal 200, status
  end

  test "can visit show" do
    get "/coins/#{@coins.first.slug}"
    assert_equal 200, status
  end
end
