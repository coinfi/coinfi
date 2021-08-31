require 'sidekiq'
require 'sidekiq-scheduler'

is_production = (ENV['IS_PRODUCTION'] || "false").downcase == 'true'
redis_url = ENV.fetch('REDISCLOUD_URL')

Sidekiq.configure_server do |config|
  config.redis = { url: redis_url }

  config.on(:startup) do
    # https://github.com/mperham/sidekiq/issues/3879#issuecomment-642295502
    ActiveRecord::Base.clear_active_connections!

    # load production-specific schedule config
    if is_production
      Sidekiq.schedule = YAML.load_file(File.expand_path('../../sidekiq_schedule_production.yml', __FILE__))
    else
      Sidekiq.schedule = YAML.load_file(File.expand_path('../../sidekiq_schedule_non_production.yml', __FILE__))
    end

    SidekiqScheduler::Scheduler.instance.reload_schedule!
  end
end

Sidekiq.configure_client do |config|
  config.redis = { url: redis_url }
end

