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

  self.use_transactional_tests = false

  ActiveRecord::Migration.check_pending!

  setup do
    DatabaseCleaner.start
  end

  teardown do
    DatabaseCleaner.clean
  end
end
