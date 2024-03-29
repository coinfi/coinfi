namespace :data_migrations do
  desc "Migrate Price Data"
  task :migrate_price_data => :environment do
    etl_db_name = ENV.fetch('ETL_DB_NAME')
    etl_db_port = ENV.fetch('ETL_DB_PORT')
    etl_db_host = ENV.fetch('ETL_DB_HOST')
    etl_db_user = ENV.fetch('ETL_DB_USER')
    etl_db_pass = ENV.fetch('ETL_DB_PASSWORD')
    export_table_name = 'cmc_daily_ohcl_prices'
    import_table_name = 'daily_ohcl_prices'
    view_name = "etldb_#{export_table_name}_view"

    puts "Migrating price data from #{export_table_name} to #{import_table_name}"

    ActiveRecord::Base.connection_pool.with_connection do |connection|
      puts "Creating view #{view_name}"
      view_query = <<~SQL
        CREATE OR REPLACE VIEW #{view_name} AS
        SELECT *
        FROM dblink(
          'dbname=#{etl_db_name} port=#{etl_db_port} host=#{etl_db_host} user=#{etl_db_user} password=#{etl_db_pass}',
          'select coin_key, to_currency, time, open, high, low, close, volume_to
            from staging.#{export_table_name}'
        )
        AS t1(
          coin_key varchar,
          to_currency varchar,
          time timestamp,
          open numeric,
          high numeric,
          low numeric,
          close numeric,
          volume_to numeric
        );
      SQL
      connection.execute view_query

      puts "Inserting entries from #{view_name} to #{import_table_name}"
      update_query = <<~SQL
        INSERT INTO #{import_table_name} (
          coin_id, to_currency, time, open, high, low, close, volume_to
        )
        SELECT
          coins.id as coin_id,
          v1.to_currency,
          v1.time,
          v1.open,
          v1.high,
          v1.low,
          v1.close,
          v1.volume_to
        FROM #{view_name} v1
        JOIN coins on v1.coin_key = coins.coin_key
        ON CONFLICT DO NOTHING;
      SQL
      connection.execute update_query

      puts "Dropping view #{view_name}"
      connection.execute "DROP VIEW #{view_name};"
    end
  end

  desc "Copy Price Data"
  task :copy_price_data => :environment do
    db_url = ENV.fetch("PRODUCTION_DB_URL")
    db_match = /^postgres(.*?):\/\/(?<user>[a-zA-Z0-9]*):(?<pass>[a-zA-Z0-9]*)@(?<host>[^:]*):(?<port>\d+)\/(?<name>.+)$/.match db_url
    raise ArgumentError.new("Could not parse PRODUCTION_DB_URL") if db_match.nil?
    prod_db_name = db_match[:name]
    prod_db_port = db_match[:port]
    prod_db_host = db_match[:host]
    prod_db_user = db_match[:user]
    prod_db_pass = db_match[:pass]
    export_table_name = 'daily_ohcl_prices'
    import_table_name = 'daily_ohcl_prices'
    view_name = "proddb_#{export_table_name}_view"

    puts "Copy price data from #{export_table_name} to #{import_table_name}"

    ActiveRecord::Base.connection_pool.with_connection do |connection|
      puts "Creating view #{view_name}"
      view_query = <<~SQL
        CREATE OR REPLACE VIEW #{view_name} AS
        SELECT *
        FROM dblink(
          'dbname=#{prod_db_name} port=#{prod_db_port} host=#{prod_db_host} user=#{prod_db_user} password=#{prod_db_pass}',
          'select coins.coin_key, to_currency, time, open, high, low, close, volume_to
            from #{export_table_name} as export_table
            join coins on export_table.coin_id = coins.id'
        )
        AS t1(
          coin_key varchar,
          to_currency varchar,
          time timestamp,
          open numeric,
          high numeric,
          low numeric,
          close numeric,
          volume_to numeric
        );
      SQL
      connection.execute view_query

      puts "Inserting entries from #{view_name} to #{import_table_name}"
      update_query = <<~SQL
        INSERT INTO #{import_table_name} (
          coin_id, to_currency, time, open, high, low, close, volume_to
        )
        SELECT
          coins.id as coin_id,
          v1.to_currency,
          v1.time,
          v1.open,
          v1.high,
          v1.low,
          v1.close,
          v1.volume_to
        FROM #{view_name} v1
        JOIN coins on v1.coin_key = coins.coin_key
        ON CONFLICT DO NOTHING;
      SQL
      connection.execute update_query

      puts "Dropping view #{view_name}"
      connection.execute "DROP VIEW #{view_name};"
    end
  end
end
