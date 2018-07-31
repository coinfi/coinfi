# Load the Rails application.
require_relative 'application'

# Initialize the Rails application.
Rails.application.initialize!

ActionMailer::Base.smtp_settings = {
  :port           => 587,
  :address        => ENV.fetch('SMTP_SERVER'),
  :user_name      => ENV.fetch('SMTP_USERNAME'),
  :password       => ENV.fetch('SMTP_PASSWORD'),
  :domain         => ENV.fetch('ROOT_DOMAIN'),
  :authentication => :plain,
  :enable_starttls_auto => true
}
ActionMailer::Base.delivery_method = :smtp
