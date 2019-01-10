require 'application_integration_test'
require 'test_helper'

class HomeRoutesTest < ApplicationIntegrationTest
  setup do
    @market_metrics = create_list(:market_metric, 30)
  end

  test "can visit index" do
    get "/"
    assert_equal 200, status
  end
end
