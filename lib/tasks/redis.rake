require "redis"

namespace :redis do
  desc "Make redis a slave of production redis"
  task :make_slave => :environment do
    redis = Redis.new(url: ENV.fetch('REDIS_URL'), :driver => :hiredis)
    redis.slaveof(ENV.fetch('PRODUCTION_REDIS_HOST'), ENV.fetch('PRODUCTION_REDIS_PORT'))
    redis.config('set', 'masterauth', ENV.fetch('PRODUCTION_REDIS_PASSWORD'))
    redis.config('set', 'slave-read-only', 'no')
  end

  desc "One-time copy of production redis"
  task :copy_prod => :environment do
    redisSrc = Redis.new :url => ENV.fetch('PRODUCTION_REDIS_URL')
    redisDest = Redis.new :url => ENV.fetch('REDIS_URL')

    redisSrc.keys("*:snapshot").each do |key|
      data = redisSrc.dump key
      redisDest.restore key, 0, data
    end
  end
end
