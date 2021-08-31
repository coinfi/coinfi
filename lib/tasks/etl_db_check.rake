require 'net/http'
require 'uri'

namespace :etldb do
  db_name = ENV['ETL_DB_NAME']
  db_port = ENV['ETL_DB_PORT']
  db_host = ENV['ETL_DB_HOST']
  db_user = ENV['ETL_DB_USER']
  db_pass = ENV['ETL_DB_PASSWORD']

  tables = [
    {
      'title' => "Daily",
      'name' => "cmc_daily_ohcl_prices",
      'interval' => "''2 days''",
      'url' => ENV.fetch('HEALTHCHECK_DAILY_PRICES')
    }
  ]

  coins = [
    {
      'title' => "'Bitcoin",
      'query' => lambda { Coin.where(symbol: 'BTC').pluck(:coin_key, :ranking) }
    },
    {
      'title' => "Ethereum",
      'query' => lambda { Coin.where(symbol: 'ETH').pluck(:coin_key, :ranking) }
    },
    {
      'title' => "CoinFi",
      'query' => lambda { Coin.where(symbol: 'COFI').pluck(:coin_key, :ranking) }
    },
    {
      'title' => "Top 10",
      'query' => lambda { Coin.top(10).pluck(:coin_key, :ranking) }
    },
    {
      'title' => "Random 3",
      'query' => lambda { Coin.listed.legit.order("RANDOM()").limit(3).pluck(:coin_key, :ranking) }
    }
  ]

  desc "check for recent entries in specified table of etl database"
  task :check, [:index] => :environment do |task, args|
    ActiveRecord::Base.connection_pool.with_connection do |connection|

      #set up table view
      table = tables[args.index]
      connection.execute("
        CREATE OR REPLACE VIEW #{table["name"]}_view AS
        SELECT *
        FROM dblink('
          dbname=#{db_name}
          port=#{db_port}
          host=#{db_host}
          user=#{db_user}
          password=#{db_pass}',
          'SELECT coin_key, to_currency, time, volume_to FROM staging.#{table["name"]} WHERE time >= NOW() - #{table["interval"]}::INTERVAL'
        )
        AS t1(coin_key varchar, to_currency varchar, time timestamp, volume_to numeric);
      ")

      # initialize results
      params = {
        'table' => table["title"],
        'coins' => []
      }
      success = true

      # Run all coin tests
      coins.each do |data|
        # Check each individual coin within a test
        data["query"].call.each do |coin|
          coin_key = coin[0].to_s
          ranking = coin[1]
          label = "#{table["title"]}:#{coin_key}"
          puts "Checking #{label}"

          query = "
            SELECT
              COUNT(*) AS count,
              MIN(volume_to) AS to,
              coin_key
            FROM #{table["name"]}_view
            WHERE coin_key = '#{coin_key}'
            GROUP BY coin_key;"
          result = connection.exec_query(query)

          if result.empty? then
            success = false
            params["coins"] << coin_key
          else
            # Check results. This should only be one row since we're only checking one coin at a time.
            result.each do |row|
              check_volume = !ranking.nil? && ranking < 100
              has_volume = row["to"].to_f > 0
              has_results = row["count"] > 0

              # there should be at least one entry and if ranking < 100 volume should be non-zero
              if !has_results || (check_volume && !has_volume) then
                success = false
                params["coins"] << coin_key
              end
            end
          end
        end
      end

      # format results
      params["coins"] = params["coins"].uniq

      # send response
      if success then
        Net::HTTP.get(URI.parse(table["url"]))
      else
        Net::HTTP.post(URI.parse("#{table["url"]}/fail"), params.to_json)
      end

      # clean up
      connection.execute("
        DROP VIEW #{table["name"]}_view;
      ")
    end
  end

  desc "check for recent entries in daily table of etl database"
  task check_daily: :environment do
    Rake::Task["etldb:check"].invoke(0)
  end

  desc "check for recent entries in all tables of etl database"
  task check_all: :environment do
    tables.each_with_index do |val, index|
      if index > 0 then
        Rake::Task["etldb:check"].reenable
      end
      Rake::Task["etldb:check"].invoke(index)
    end
  end
end