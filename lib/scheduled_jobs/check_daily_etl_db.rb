require 'sidekiq-scheduler'
require 'rake'
# Invoking rake task based on https://stackoverflow.com/a/9943895
class CheckDailyEtlDb
  include Sidekiq::Worker

  def initialize
    Rake::Task.clear # necessary to avoid tasks being loaded several times in dev mode
    CoinfiRails::Application.load_tasks
  end

  def perform
    Rake::Task['etldb:check_daily'].reenable # in case you're going to invoke the same task second time.
    Rake::Task['etldb:check_daily'].invoke
  end
end