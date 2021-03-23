credentials = Aws::Credentials.new(ENV.fetch('AWS_ACCESS_KEY_ID'), ENV.fetch('AWS_SECRET_ACCESS_KEY'))

# Aws.config.update({
#   region: 'us-east-1',
#   credentials: credentials,
# })

Aws::Rails.add_action_mailer_delivery_method(
  :aws_sdk,
  credentials: credentials,
  region: 'eu-west-1'
)