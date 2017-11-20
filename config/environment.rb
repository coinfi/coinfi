# Load the Rails application.
require_relative 'application'

# Initialize the Rails application.
Rails.application.initialize!

ActionMailer::Base.smtp_settings = {
  :port           => ENV['MAILGUN_SMTP_PORT'],
  :address        => 'smtp.webfaction.com', #ENV['MAILGUN_SMTP_SERVER'],
  :user_name      => 'coinfi', #ENV['MAILGUN_SMTP_LOGIN'],
  :password       => ENV.fetch('WEBFACTION_SMTP_PASSWORD'), #ENV['MAILGUN_SMTP_PASSWORD'],
  :domain         => ENV.fetch('ROOT_DOMAIN'),
  :authentication => :plain,
}
ActionMailer::Base.delivery_method = :smtp
