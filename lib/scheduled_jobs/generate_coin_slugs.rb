# The ETL upsert DAG runs at midnight UTC
# so this job should be run at 01:00 UTC
# in Sidekiq Scheduler.
require 'sidekiq-scheduler'
class GenerateCoinSlugs
  include Sidekiq::Worker

  # Generate Coin slugs from ETL upsert
  def perform
    Coin.unslugged.find_each do |coin|
      begin
        coin.save!
      rescue => e
        puts "#{coin.id}: #{coin.name}", e
      end
    end
  end
end