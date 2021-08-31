class IngestEtlDbMetricsService < Patterns::Service
  attr_reader :log_errors

  def initialize(full_refresh: false)
    @full_refresh = full_refresh
    @results = 0
    @log_errors = []

    @etl_db_name = ENV.fetch('ETL_DB_NAME')
    @etl_db_port = ENV.fetch('ETL_DB_PORT')
    @etl_db_host = ENV.fetch('ETL_DB_HOST')
    @etl_db_user = ENV.fetch('ETL_DB_USER')
    @etl_db_pass = ENV.fetch('ETL_DB_PASSWORD')
    @view_name = 'etldb_metrics_view'
  end

  def call
    begin
      checkout_connection
      create_view!
      ingest!
      drop_view!
    ensure
      checkin_connection
    end

    @results
  end

  def create_view!
    @connection.execute("CREATE OR REPLACE VIEW #{@view_name} AS
      SELECT *
      FROM dblink('dbname=#{@etl_db_name} port=#{@etl_db_port} host=#{@etl_db_host} user=#{@etl_db_user} password=#{@etl_db_pass}',
                  'select token_address, metric_type, date, metric_value from staging.metrics')
      AS t1(token_address varchar, metric_type varchar, date date, metric_value double precision);")
  end

  def ingest!
    latest = Metric.maximum(:date) unless @full_refresh
    puts "Ingesting metrics data from #{latest.present? ? latest.to_formatted_s(:db) : "inception"}"

    query = "SELECT * FROM #{@view_name}
              #{"WHERE date >= '#{latest.to_formatted_s(:db)}'" if latest.present?}
              ORDER BY date, token_address, metric_type;"
    result = @connection.exec_query(query)

    result.each_slice(1000) do |group|
      metric_entries = group.map do |row|
        Metric.new(
          token_address: row["token_address"],
          metric_type: row["metric_type"],
          date: row["date"],
          metric_value: row["metric_value"],
        )
      end

      import_results = Metric.import metric_entries, :validate => false, on_duplicate_key_update: {
          constraint_name: :composite_key, columns: [:metric_value]
        }

      log_results(import_results)
    end
  end

  def drop_view!
    @connection.execute("DROP VIEW #{@view_name};")
  end

  def log_results(results)
    if results.failed_instances.present?
      results.failed_instances.each do |row|
        @log_errors << {
          token_address: row["token_address"],
          metric_type: row["metric_type"],
          date: row["date"],
          metric_value: row["metric_value"],
        }
      end
    end

    @results += results.num_inserts
  end

  def checkout_connection
    @connection = ActiveRecord::Base.connection_pool.checkout
  end

  def checkin_connection
    ActiveRecord::Base.connection_pool.checkin(@connection)
  end
end