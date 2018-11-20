require 'sidekiq'
require 'sidekiq-scheduler'

Sidekiq.configure_server do |config|
  config.on(:startup) do
    # load production-specific schedule config
    if ENV.fetch('ROOT_DOMAIN') == 'www.coinfi.com'
      Sidekiq.schedule = YAML.load_file(File.expand_path('../../sidekiq_production.yml', __FILE__))
      SidekiqScheduler::Scheduler.instance.reload_schedule!
    end
  end
end

