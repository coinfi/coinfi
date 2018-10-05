require 'application_integration_test'
require 'test_helper'

class CoinsRoutesTest < ApplicationIntegrationTest
  setup do
    @coin = Coin.create(name: 'Bitcoin')
  end

  test "can visit index" do
    get "/coins"
    assert_equal 200, status
  end

  test "can visit show" do
    get "/coins/#{@coin.slug}"
    assert_equal 200, status
  end
end
