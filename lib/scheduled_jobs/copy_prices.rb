require 'sidekiq-scheduler'
require 'rake'
# Invoking rake task based on https://stackoverflow.com/a/9943895
class CopyPrices
  include Sidekiq::Worker

  def initialize
    Rake::Task.clear # necessary to avoid tasks being loaded several times in dev mode
    CoinfiRails::Application.load_tasks
  end

  def perform
    Rake::Task['data_migrations:copy_price_data'].reenable # in case you're going to invoke the same task second time.
    Rake::Task['data_migrations:copy_price_data'].invoke
  end
end