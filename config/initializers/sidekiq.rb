require 'sidekiq'
require 'sidekiq-scheduler'

is_production = (ENV['IS_PRODUCTION'] || "false").downcase == 'true'
redis_url = ENV.fetch('REDISCLOUD_URL') if is_production

Sidekiq.configure_server do |config|
  if is_production
    config.redis = { url: redis_url }
  end

  config.on(:startup) do
    # load production-specific schedule config
    if is_production
      Sidekiq.schedule = YAML.load_file(File.expand_path('../../sidekiq_production.yml', __FILE__))
      SidekiqScheduler::Scheduler.instance.reload_schedule!
    end
  end
end

Sidekiq.configure_client do |config|
  if is_production
    config.redis = { url: redis_url }
  end
end

