require 'test_helper'

class HomeRoutesTest < ActionDispatch::IntegrationTest
  test "can visit index" do
    get "/"
    assert_equal 200, status
  end
end
