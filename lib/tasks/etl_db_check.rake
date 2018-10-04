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
            'name' => "daily_ohcl_prices",
            'interval' => "''1 day''",
            'url' => "https://hc-ping.com/772bacf5-958e-4541-b8ca-a81fe24c63d0"
        },
        {
            'title' => "Hourly",
            'name' => "hourly_ohcl_prices",
            'interval' => "''1 hour''",
            'url' => "https://hc-ping.com/c49dcf87-c6e5-4881-95f8-3bfad31d33ff"
        }
    ]

    coins = [
        {
            'title' => "'Bitcoin",
            'query' => lambda { Coin.where(symbol: 'BTC').pluck(:coin_key, :ranking) },
            'url' => "https://hc-ping.com/67fffb49-c4d7-4e3f-a7cf-4688495c00d1"
        },
        {
            'title' => "Ethereum",
            'query' => lambda { Coin.where(symbol: 'ETH').pluck(:coin_key, :ranking) },
            'url' => "https://hc-ping.com/67fffb49-c4d7-4e3f-a7cf-4688495c00d1"
        },
        {
            'title' => "CoinFi",
            'query' => lambda { Coin.where(symbol: 'COFI').pluck(:coin_key, :ranking) },
            'url' => "https://hc-ping.com/67fffb49-c4d7-4e3f-a7cf-4688495c00d1"
        },
        {
            'title' => "Top 10",
            'query' => lambda { Coin.top(10).pluck(:coin_key, :ranking) },
            'url' => "https://hc-ping.com/67fffb49-c4d7-4e3f-a7cf-4688495c00d1"
        },
        {
            'title' => "Random 3",
            'query' => lambda { Coin.all.order("RANDOM()").limit(3).pluck(:coin_key, :ranking) },
            'url' => "https://hc-ping.com/67fffb49-c4d7-4e3f-a7cf-4688495c00d1"
        }            
    ]

    desc "check for recent entries in specified table of etl database"
    task :check, [:index] => :environment do |task, args|
        @connection ||= ActiveRecord::Base.connection
        table = tables[args.index]

        @connection.execute("
            CREATE OR REPLACE VIEW #{table["name"]}_view AS
            SELECT *
            FROM dblink('
                dbname=#{db_name}
                port=#{db_port} 
                host=#{db_host} 
                user=#{db_user} 
                password=#{db_pass}',
                'SELECT coin_key, to_currency, time, volume_from, volume_to FROM staging.#{table["name"]} WHERE time >= NOW() - #{table["interval"]}::INTERVAL'
            )
            AS t1(coin_key varchar, to_currency varchar, time timestamp, volume_from numeric, volume_to numeric);
        ")

        
        params = {
            'table' => table["title"],
            'coins' => []
        }
        success = true

        coins.each do |data|
            data["query"].call.each do |coin|
                coin_key = coin[0].to_s
                label = "#{table["title"]}:#{coin_key}"
                puts "Checking #{label}"

                query = "SELECT COUNT(*) AS count, MIN(volume_from) AS from, MIN(volume_to) AS to, coin_key FROM #{table["name"]}_view 
                    WHERE coin_key = '#{coin_key}'
                    GROUP BY coin_key;"
                result = @connection.exec_query(query)

                if result.empty? then
                    success = false
                    params["coins"] << coin_key
                else
                    result.each do |row|
                        check_volume = !coin[1].nil? && coin[1] < 100
                        has_volume = row["from"].to_f > 0 && row["to"].to_f > 0
                        has_results = row["count"] > 0
                    
                        if !has_results || (check_volume && !has_volume) then
                            success = false
                            params["coins"] << coin_key
                        end
                    end
                end                   
            end
        end

        params["coins"] = params["coins"].uniq

        if success then
            Net::HTTP.get(URI.parse(table["url"]))
        else
            Net::HTTP.post(URI.parse("#{table["url"]}/fail"), params.to_json)
        end
    end

    desc "check for recent entries in daily table of etl database"
    task check_daily: :environment do
        Rake::Task["etldb:check"].invoke(0)
    end

    desc "check for recent entries in hourly table of etl database"
    task check_hourly: :environment do
        Rake::Task["etldb:check"].invoke(1)
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