namespace :data_migrations do
  desc "One-time task to fill metrics table without validation or checking for duplicates."
  task :populate_metrics_from_etl_db => :environment do
    @etl_db_name = ENV.fetch('ETL_DB_NAME')
    @etl_db_port = ENV.fetch('ETL_DB_PORT')
    @etl_db_host = ENV.fetch('ETL_DB_HOST')
    @etl_db_user = ENV.fetch('ETL_DB_USER')
    @etl_db_pass = ENV.fetch('ETL_DB_PASSWORD')
    @view_name = 'etldb_metrics_view'

    ActiveRecord::Base.connection_pool.with_connection do |connection|
      connection.execute("CREATE OR REPLACE VIEW #{@view_name} AS
        SELECT *
        FROM dblink('dbname=#{@etl_db_name} port=#{@etl_db_port} host=#{@etl_db_host} user=#{@etl_db_user} password=#{@etl_db_pass}',
                    'select token_address, metric_type, date, metric_value from staging.metrics')
        AS t1(token_address varchar, metric_type varchar, date date, metric_value double precision);")

      result = connection.exec_query <<-SQL
        INSERT INTO metrics (token_address, metric_type, date, metric_value)
        SELECT token_address, metric_type, date, metric_value FROM #{@view_name}
        ORDER BY date, token_address, metric_type;
      SQL

      connection.execute("DROP VIEW #{@view_name};")
    end
  end
end
