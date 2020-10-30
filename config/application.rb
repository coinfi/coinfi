require_relative 'boot'
require_relative '../lib/middleware/handle_bad_encoding_middleware'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module CoinfiRails
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    config.autoload_paths += %W(#{config.root}/lib #{config.root}/lib/scheduled_jobs)
    config.eager_load_paths += %W(#{config.root}/lib #{config.root}/lib/scheduled_jobs)

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Use .js by default instead of .coffee
    config.generators do |g|
      g.scaffold_stylesheet false
      g.javascript_engine :js
      g.test_framework    nil, fixture: false
      g.view_specs        false
      g.helper_specs      false
    end

    config.action_view.embed_authenticity_token_in_remote_forms = true

    config.action_mailer.default_url_options = { host: ENV.fetch('ROOT_DOMAIN') }

    config.middleware.use Rack::Affiliates
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins 'https://landing.coinfi.com'
      end

      allow do
        origins '*'
        resource '/api/indicators/*', headers: :any, methods: :get
      end
    end

    config.middleware.insert(0, Rack::Rewrite) do
      r301 %r{(.+)/$}, '$1'
    end

    config.middleware.insert_before Rack::Runtime, HandleBadEncodingMiddleware

    # Give the asset pipeline access to npm packages
    config.assets.paths << Rails.root.join('node_modules')

    # Use dynamic error pages
    # Based on https://mattbrictson.com/dynamic-rails-error-pages
    config.exceptions_app = self.routes
  end
end
