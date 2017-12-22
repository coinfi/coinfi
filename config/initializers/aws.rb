Aws.config.update({
  region: 'us-east-1',
  credentials: Aws::Credentials.new(ENV.fetch('AWS_ACCESS_KEY_ID'), ENV.fetch('AWS_SECRET_ACCESS_KEY')),
})

S3_BUCKET = Aws::S3::Resource.new.bucket(ENV.fetch('S3_BUCKET'))
