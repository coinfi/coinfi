Rails.application.configure do
  config.lograge.enabled = true if Rails.env.production?
end

