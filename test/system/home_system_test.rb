require "application_system_test_case"
require 'test_helper'

class HomeSystemTest < ApplicationSystemTestCase
  test "visiting the index" do
    visit '/'

    assert_selector "h1", text: "Be the first to know the news that moves the market"
  end
end
