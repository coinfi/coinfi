require "application_system_test_case"
require 'test_helper'

class SignalsSystemTest < ApplicationSystemTestCase
  test "can visit the index" do
    visit '/signals'

    assert_selector "h1", text: "Professional trading signals backed by data science Beta"
  end

  test "can visit reservation" do
    visit '/signals/reservation'

    assert_selector "h1", text: "Instructions for Reserving Your Spot"
  end
end
