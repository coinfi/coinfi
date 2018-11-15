require "redis"

namespace :redis do
  desc "Make redis a slave of production redis"
  task :make_slave => :environment do
    prod_redis_uri = URI.parse(ENV.fetch('PRODUCTION_REDIS_URL'))
    redis = Redis.new(url: ENV.fetch('REDIS_URL'), :driver => :hiredis)
    redis.slaveof(prod_redis_uri.host, prod_redis_uri.port)
    redis.config('set', 'masterauth', prod_redis_uri.password)
    redis.config('set', 'slave-read-only', 'no')
  end

  desc "One-time copy of production redis"
  task :copy_prod => :environment do
    prod_redis_uri = ENV.fetch('PRODUCTION_REDIS_URL')
    local_redis_uri = ENV.fetch('REDIS_URL')
    next if prod_redis_uri == local_redis_uri

    redisSrc = Redis.new :url => prod_redis_uri
    redisDest = Redis.new :url => local_redis_uri

    redisSrc.keys("*:snapshot").each do |key|
      data = redisSrc.dump key
      redisDest.restore key, 0, data
    end
  end
end
