require 'sidekiq'
require 'sidekiq-scheduler'

Sidekiq.configure_server do |config|
  config.on(:startup) do
    # load production-specific schedule config
    is_production = ENV['IS_PRODUCTION'] || "false"
    if is_production.downcase == 'true'
      Sidekiq.schedule = YAML.load_file(File.expand_path('../../sidekiq_production.yml', __FILE__))
      SidekiqScheduler::Scheduler.instance.reload_schedule!
    end
  end
end

