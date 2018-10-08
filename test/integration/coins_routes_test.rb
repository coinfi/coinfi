require 'application_integration_test'
require 'test_helper'

class CoinsRoutesTest < ApplicationIntegrationTest
  setup do
    @coins = create_list(:coin, 10)
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
