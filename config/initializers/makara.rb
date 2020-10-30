if ENV["MAKARA_ENABLED"]
  Makara::Logging::Logger.logger = Rails.logger
  Rails.configuration.middleware.delete Makara::Middleware
end