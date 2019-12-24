Rails.application.configure do
  # Verifies that versions and hashed value of the package contents in the project's package.json
  config.webpacker.check_yarn_integrity = true

  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # Run rails dev:cache to toggle caching.
  if Rails.root.join('tmp', 'caching-dev.txt').exist?
    config.action_controller.perform_caching = true
    config.public_file_server.headers = {
      'Cache-Control' => "public, max-age=#{2.days.seconds.to_i}"
    }
  else
    config.action_controller.perform_caching = false
  end

  if ENV['REDIS_URL'].present?
    config.cache_store = :redis_cache_store, {driver: :hiredis, url: ENV['REDIS_URL']}
  else
    config.cache_store = :null_store
  end

  # Allow CORS
  config.action_dispatch.default_headers = {
    'Access-Control-Allow-Origin' => '*',
  }

  # Store uploaded files on the local file system (see config/storage.yml for options)
  config.active_storage.service = :local

  # Use letter opener to preview emails
  config.action_mailer.perform_caching = false

  if ENV["PREVIEW_EMAIL_LOCALLY"].present?
    config.action_mailer.delivery_method = :letter_opener
    config.action_mailer.perform_deliveries = true
  else
    config.action_mailer.raise_delivery_errors = false
  end

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Suppress logger output for asset requests.
  config.assets.quiet = true

  # Do not write to log/development.log file.
  config.logger = ActiveSupport::Logger.new(nil)

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true

  # Use an evented file watcher to asynchronously detect changes in source code,
  # routes, locales, etc. This feature depends on the listen gem.
  config.file_watcher = ActiveSupport::EventedFileUpdateChecker

  config.after_initialize do
    Bullet.enable = true
    Bullet.rails_logger = true
    Bullet.bullet_logger = true
  end
end
