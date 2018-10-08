require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require "factory_bot_rails"
require 'minitest/autorun'
require 'minitest/stub_any_instance'

DatabaseCleaner.strategy = :truncation
DatabaseCleaner.logger = Rails.logger

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
  include FactoryBot::Syntax::Methods
  include Warden::Test::Helpers

  # Unfortunately uncommitted transactional data is not accessible to external drivers (e.g. the
  # ones used in system tests)
  # See https://stackoverflow.com/a/6316184
  self.use_transactional_tests = false
  # Use `DatabaseCleaner` to reset the database instead of `use_transactional_tests`
  setup { DatabaseCleaner.start }
  teardown { DatabaseCleaner.clean }

  # Ensure there are no pending migrations
  ActiveRecord::Migration.check_pending!
end
