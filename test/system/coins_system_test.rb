require 'application_system_capybara_test'
require 'test_helper'

class CoinsRoutesTest < ApplicationSystemCapybaraTest
  setup do
    @coin = Coin.find_by(name: 'Bitcoin')
  end

  test "can see trading view" do
    Capybara.visit "/coins/#{@coin.slug}"

    Capybara.page.click_button('TradingView Chart')
    Capybara.page.save_screenshot("screenshot-#{Time.now.to_i}.png")

    iframe_selector = 'div#tradingview iframe'
    iframe_element_selector = 'div.chart-container.active'

    has_iframe = Capybara.page.has_selector?(iframe_selector)
    has_iframe_element = nil
    Capybara.page.within_frame(Capybara.page.find(iframe_selector)) do
      has_iframe_element = Capybara.page.has_selector?(iframe_element_selector)
    end

    assert_equal has_iframe, true
    assert_equal has_iframe_element, true
  end
end
