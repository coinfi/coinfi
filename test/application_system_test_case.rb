require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: :chrome, screen_size: [1400, 1400], options: { args: %w[headless disable-gpu] }

  setup do
    ReactOnRails::TestHelper.ensure_assets_compiled
  end
end
