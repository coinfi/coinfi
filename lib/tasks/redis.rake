require "redis"

namespace :redis do
  desc "Make redis a slave of production redis"
  task :make_slave => :environment do
    raw_prod_redis_uri = ENV['PRODUCTION_REDIS_URL']
    next if raw_prod_redis_uri.blank?

    prod_redis_uri = URI.parse(raw_prod_redis_uri)
    redis = Redis.new(url: ENV.fetch('REDIS_URL'), :driver => :hiredis)
    redis.slaveof(prod_redis_uri.host, prod_redis_uri.port)
    redis.config('set', 'masterauth', prod_redis_uri.password)
    redis.config('set', 'slave-read-only', 'no')
  end

  desc "One-time copy of production redis"
  task :copy_prod => :environment do
    puts "Starting redis copy."
    prod_redis_uri = ENV['PRODUCTION_REDIS_URL']
    local_redis_uri = ENV.fetch('REDIS_URL')
    if prod_redis_uri.blank? || prod_redis_uri == local_redis_uri
      puts "Skipping redis copy for production."
      next
    end

    redisSrc = Redis.new :url => prod_redis_uri
    redisDest = Redis.new :url => local_redis_uri

    redisSrc.keys("*:snapshot").each do |key|
      data = redisSrc.dump key
      redisDest.restore key, 0, data
    end
    puts "Finished redis copy."
  end

  desc "Add local key prefix"
  task :copy_local => :environment do
    redis_uri = ENV.fetch('REDIS_URL')
    parsed_redis_url = URI.parse(redis_uri)
    prefix = parsed_redis_url.path.match(/\/\d+\/(.+)/)[1]
    next if prefix.blank?

    redis = Redis.new :url => redis_uri
    redis.keys("*:snapshot").each do |key|
      redis.rename key, "#{prefix}:#{key}"
    end
  end
end