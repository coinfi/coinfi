require "test_helper"
require "capybara/rails"

class ApplicationSystemCapybaraTest < ActionDispatch::SystemTestCase
  setup do
    ReactOnRails::TestHelper.ensure_assets_compiled

    Capybara.server = :webrick
    Capybara.default_driver = :selenium_chrome
    Capybara.javascript_driver = :selenium_chrome
    Capybara.current_driver = Capybara.javascript_driver
    Capybara.app_host = "http://localhost:3001"
    Capybara.server_host = "localhost"
    Capybara.server_port = "3001"
    Capybara.default_max_wait_time = 5
  end
end
