require "redis"

namespace :redis do
  desc "Make redis a slave of production redis"
  task :make_slave => :environment do
    redis = Redis.new(url: ENV.fetch('REDIS_URL'))
    redis.slaveof(ENV.fetch('PRODUCTION_REDIS_HOST'), ENV.fetch('PRODUCTION_REDIS_PORT'))
    redis.config('set', 'masterauth', ENV.fetch('PRODUCTION_REDIS_PASSWORD'))
    redis.config('set', 'slave-read-only', 'no')
  end
end
