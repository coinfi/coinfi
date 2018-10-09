require "test_helper"

class ApplicationIntegrationTest < ActionDispatch::IntegrationTest
  setup do
    ReactOnRails::TestHelper.ensure_assets_compiled
  end
end
