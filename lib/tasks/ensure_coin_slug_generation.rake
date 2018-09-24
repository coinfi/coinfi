# The ETL upsert DAG runs at midnight UTC
# so this job should be run at 01:00 UTC
# in Heroku Scheduler.
desc "Generate Coin slugs from ETL upsert"
task :generate_coin_slugs => :environment do
  Coin.unslugged.find_each do |coin|
    begin
      coin.save!
    rescue => e
      puts "#{coin.id}: #{coin.name}", e
    end
  end
end
