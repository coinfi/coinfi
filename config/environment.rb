# Load the Rails application.
require_relative 'application'

# Before environment specific configuration
ActionMailer::Base.smtp_settings = {
  :port           => 587,
  :address        => 'smtp.webfaction.com',
  :user_name      => 'coinfi',
  :password       => ENV.fetch('WEBFACTION_SMTP_PASSWORD'),
  :domain         => ENV.fetch('ROOT_DOMAIN'),
  :authentication => :plain,
}
ActionMailer::Base.delivery_method = :smtp

# Initialize the Rails application.
Rails.application.initialize!

# After environment specific configuration
