require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

Dir[Rails.root.join("test/support/**/*.rb")].each { |f| require f }

class ActiveSupport::TestCase
  include FactoryBot::Syntax::Methods
  include SignInHelper

  use_transactional_tests = true

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
end
