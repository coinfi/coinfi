require "application_system_test_case"
require 'test_helper'

class HomeSystemTest < ApplicationSystemTestCase
  test "can visit the index" do
    visit '/'

    assert_selector "h1", text: "Be the first to know the news that moves the market"
  end

  test "can visit blockchain-data" do
    visit '/landing/blockchain-data'

    assert_selector "h1", text: "Use blockchain analytics to detect market movements before they happen."
  end

  test "can visit about" do
    visit page_about_url

    assert_selector "h1", text: "About CoinFi"
  end

  test "can visit press" do
    visit page_press_url

    assert_selector "h1", text: "Press"
  end

  test "can visit ambassadors" do
    visit page_ambassadors_url

    assert_selector "iframe#type-form"
  end

  test "can visit win cofi" do
    visit page_win_cofi_url

    assert_selector "iframe"
  end

  test "can visit podcast" do
    visit podcast_url

    assert_selector "h1", text: "Category: Podcast"
  end
end
