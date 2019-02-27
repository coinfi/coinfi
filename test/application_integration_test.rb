require "test_helper"

class ApplicationIntegrationTest < ActionDispatch::IntegrationTest
  setup do
    ReactOnRails::TestHelper.ensure_assets_compiled

    postgres_url = ENV.fetch('COINFI_POSTGREST_URL')

    stub_request(:get, Regexp.new("#{postgres_url}/daily_ohcl_prices")).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'daily_ohcl_prices.json')))

    stub_request(:get, Regexp.new("#{postgres_url}/daily_ohcl_prices")).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'cmc_daily_ohcl_prices.json')))

    stub_request(:get, Regexp.new("#{postgres_url}/hourly_ohcl_prices")).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'hourly_ohcl_prices.json')))
  end

  protected

  def initialize_views
    @connection ||= ActiveRecord::Base.connection
    @connection.execute <<-SQL
      CREATE MATERIALIZED VIEW exchange_supply_view AS select
        RANK() OVER(ORDER BY metrics_after.metric_value DESC) AS rank,
        SUM(1) OVER() AS num_coins,
        metrics_after.metric_value * 100.0 AS metric_value,
        COALESCE(100.0 * (metrics_after.metric_value / NULLIF(metrics_1d_before.metric_value, 0) - 1), 0.0) as change_1d,
        COALESCE(100.0 * (metrics_after.metric_value / NULLIF(metrics_7d_before.metric_value, 0) - 1), 0.0) as change_7d,
        COALESCE(100.0 * (metrics_after.metric_value / NULLIF(metrics_30d_before.metric_value, 0) - 1), 0.0) as change_30d,
        coin_key
      FROM metrics AS metrics_after
      JOIN coins
      ON metrics_after.token_address = coins.eth_address
      JOIN metrics AS metrics_1d_before
      ON metrics_1d_before.token_address = coins.eth_address
      AND metrics_1d_before.metric_type = metrics_after.metric_type
      AND metrics_after.date - metrics_1d_before.date = 1
      JOIN metrics AS metrics_7d_before
      ON metrics_7d_before.token_address = coins.eth_address
      AND metrics_7d_before.metric_type = metrics_after.metric_type
      AND metrics_after.date - metrics_7d_before.date = 7
      JOIN metrics AS metrics_30d_before
      ON metrics_30d_before.token_address = coins.eth_address
      AND metrics_30d_before.metric_type = metrics_after.metric_type
      AND metrics_after.date - metrics_30d_before.date = 30
      WHERE metrics_after.metric_type = 'exchange_supply'
      AND metrics_after.date = (select max(date) FROM metrics)
      WITH DATA;
    SQL

    @connection.execute <<-SQL
      CREATE UNIQUE INDEX CONCURRENTLY index_exchange_supply_view ON exchange_supply_view(coin_key);
    SQL

    @connection.execute <<-SQL
      CREATE MATERIALIZED VIEW token_retention_rate_view AS select
        RANK() OVER(ORDER BY metrics_after.metric_value DESC) AS rank,
        SUM(1) OVER() AS num_coins,
        metrics_after.metric_value * 100.0 AS metric_value,
        COALESCE(100.0 * (metrics_after.metric_value / NULLIF(metrics_1d_before.metric_value, 0) - 1), 0.0) as change_1d,
        COALESCE(100.0 * (metrics_after.metric_value / NULLIF(metrics_7d_before.metric_value, 0) - 1), 0.0) as change_7d,
        COALESCE(100.0 * (metrics_after.metric_value / NULLIF(metrics_30d_before.metric_value, 0) - 1), 0.0) as change_30d,
        coin_key
      FROM metrics AS metrics_after
      JOIN coins
      ON metrics_after.token_address = coins.eth_address
      JOIN metrics AS metrics_1d_before
      ON metrics_1d_before.token_address = coins.eth_address
      AND metrics_1d_before.metric_type = metrics_after.metric_type
      AND metrics_after.date - metrics_1d_before.date = 1
      JOIN metrics AS metrics_7d_before
      ON metrics_7d_before.token_address = coins.eth_address
      AND metrics_7d_before.metric_type = metrics_after.metric_type
      AND metrics_after.date - metrics_7d_before.date = 7
      JOIN metrics AS metrics_30d_before
      ON metrics_30d_before.token_address = coins.eth_address
      AND metrics_30d_before.metric_type = metrics_after.metric_type
      AND metrics_after.date - metrics_30d_before.date = 30
      WHERE metrics_after.metric_type = 'token_retention_rate'
      AND metrics_after.date = (select max(date) FROM metrics)
      WITH DATA;
    SQL

    @connection.execute <<-SQL
      CREATE UNIQUE INDEX CONCURRENTLY index_token_retention_rate_view ON token_retention_rate_view(coin_key);
    SQL

    @connection.execute <<-SQL
      CREATE MATERIALIZED VIEW unique_wallet_count_view AS select
        RANK() OVER(ORDER BY metrics_after.metric_value DESC) AS rank,
        SUM(1) OVER() AS num_coins,
        metrics_after.metric_value,
        COALESCE(100.0 * (metrics_after.metric_value / NULLIF(metrics_1d_before.metric_value, 0) - 1), 0.0) as change_1d,
        COALESCE(100.0 * (metrics_after.metric_value / NULLIF(metrics_7d_before.metric_value, 0) - 1), 0.0) as change_7d,
        COALESCE(100.0 * (metrics_after.metric_value / NULLIF(metrics_30d_before.metric_value, 0) - 1), 0.0) as change_30d,
        coin_key
      FROM metrics AS metrics_after
      JOIN coins
      ON metrics_after.token_address = coins.eth_address
      JOIN metrics AS metrics_1d_before
      ON metrics_1d_before.token_address = coins.eth_address
      AND metrics_1d_before.metric_type = metrics_after.metric_type
      AND metrics_after.date - metrics_1d_before.date = 1
      JOIN metrics AS metrics_7d_before
      ON metrics_7d_before.token_address = coins.eth_address
      AND metrics_7d_before.metric_type = metrics_after.metric_type
      AND metrics_after.date - metrics_7d_before.date = 7
      JOIN metrics AS metrics_30d_before
      ON metrics_30d_before.token_address = coins.eth_address
      AND metrics_30d_before.metric_type = metrics_after.metric_type
      AND metrics_after.date - metrics_30d_before.date = 30
      WHERE metrics_after.metric_type = 'unique_wallet_count'
      AND metrics_after.date = (select max(date) FROM metrics)
      WITH DATA;
    SQL

    @connection.execute <<-SQL
      CREATE UNIQUE INDEX CONCURRENTLY index_unique_wallet_count_view ON unique_wallet_count_view(coin_key);
    SQL

    @connection.execute <<-SQL
      CREATE MATERIALIZED VIEW token_distribution_100_view AS select
        RANK() OVER(ORDER BY metrics_after.metric_value) AS rank,
        SUM(1) OVER() AS num_coins,
        metrics_after.metric_value * 100.0 AS metric_value,
        COALESCE(100.0 * (metrics_after.metric_value / NULLIF(metrics_1d_before.metric_value, 0) - 1), 0.0) as change_1d,
        COALESCE(100.0 * (metrics_after.metric_value / NULLIF(metrics_7d_before.metric_value, 0) - 1), 0.0) as change_7d,
        COALESCE(100.0 * (metrics_after.metric_value / NULLIF(metrics_30d_before.metric_value, 0) - 1), 0.0) as change_30d,
        coin_key
      FROM metrics AS metrics_after
      JOIN coins
      ON metrics_after.token_address = coins.eth_address
      JOIN metrics AS metrics_1d_before
      ON metrics_1d_before.token_address = coins.eth_address
      AND metrics_1d_before.metric_type = metrics_after.metric_type
      AND metrics_after.date - metrics_1d_before.date = 1
      JOIN metrics AS metrics_7d_before
      ON metrics_7d_before.token_address = coins.eth_address
      AND metrics_7d_before.metric_type = metrics_after.metric_type
      AND metrics_after.date - metrics_7d_before.date = 7
      JOIN metrics AS metrics_30d_before
      ON metrics_30d_before.token_address = coins.eth_address
      AND metrics_30d_before.metric_type = metrics_after.metric_type
      AND metrics_after.date - metrics_30d_before.date = 30
      WHERE metrics_after.metric_type = 'token_distribution_100'
      AND metrics_after.date = (select max(date) FROM metrics)
      WITH DATA;
    SQL

    @connection.execute <<-SQL
      CREATE UNIQUE INDEX CONCURRENTLY index_token_distribution_100_view ON token_distribution_100_view(coin_key);
    SQL

    @connection.execute <<-SQL
      CREATE MATERIALIZED VIEW token_velocity_view AS select
        RANK() OVER(ORDER BY metrics_after.metric_value DESC) AS rank,
        SUM(1) OVER() AS num_coins,
        metrics_after.metric_value * 100.0 AS metric_value,
        COALESCE(100.0 * (metrics_after.metric_value / NULLIF(metrics_1d_before.metric_value, 0) - 1), 0.0) as change_1d,
        COALESCE(100.0 * (metrics_after.metric_value / NULLIF(metrics_7d_before.metric_value, 0) - 1), 0.0) as change_7d,
        COALESCE(100.0 * (metrics_after.metric_value / NULLIF(metrics_30d_before.metric_value, 0) - 1), 0.0) as change_30d,
        coin_key
      FROM metrics AS metrics_after
      JOIN coins
      ON metrics_after.token_address = coins.eth_address
      JOIN metrics AS metrics_1d_before
      ON metrics_1d_before.token_address = coins.eth_address
      AND metrics_1d_before.metric_type = metrics_after.metric_type
      AND metrics_after.date - metrics_1d_before.date = 1
      JOIN metrics AS metrics_7d_before
      ON metrics_7d_before.token_address = coins.eth_address
      AND metrics_7d_before.metric_type = metrics_after.metric_type
      AND metrics_after.date - metrics_7d_before.date = 7
      JOIN metrics AS metrics_30d_before
      ON metrics_30d_before.token_address = coins.eth_address
      AND metrics_30d_before.metric_type = metrics_after.metric_type
      AND metrics_after.date - metrics_30d_before.date = 30
      WHERE metrics_after.metric_type = 'exchange_supply'
      AND metrics_after.date = (select max(date) FROM metrics)
      WITH DATA;
    SQL

    @connection.execute <<-SQL
      CREATE UNIQUE INDEX CONCURRENTLY index_token_velocity_view ON token_velocity_view(coin_key);
    SQL

    @connection.execute <<-SQL
      CREATE MATERIALIZED VIEW metrics_chart_view AS SELECT
        (AVG("metrics"."metric_value") * 100.0) AS "percentage",
        CAST("metrics"."date" AS date) AS "date",
        "coin_key",
        "metric_type",
        (AVG("metrics"."metric_value")) AS "number"
      FROM "metrics"
      JOIN "coins"
      ON "metrics"."token_address" = "coins"."eth_address"
      GROUP BY CAST("metrics"."date" AS date), "metric_type", "coin_key"
      ORDER BY CAST("metrics"."date" AS date) ASC
      WITH DATA;
    SQL

    @connection.execute <<-SQL
      CREATE UNIQUE INDEX CONCURRENTLY index_metrics_chart_view ON metrics_chart_view(metric_type, coin_key, date);
    SQL
  end

  def teardown_views
    @connection ||= ActiveRecord::Base.connection
    @connection.execute <<-SQL
      DROP MATERIALIZED VIEW exchange_supply_view;
    SQL

    @connection.execute <<-SQL
      DROP MATERIALIZED VIEW token_retention_rate_view;
    SQL

    @connection.execute <<-SQL
      DROP MATERIALIZED VIEW unique_wallet_count_view;
    SQL

    @connection.execute <<-SQL
      DROP MATERIALIZED VIEW token_distribution_100_view;
    SQL

    @connection.execute <<-SQL
      DROP MATERIALIZED VIEW token_velocity_view;
    SQL

    @connection.execute <<-SQL
      DROP MATERIALIZED VIEW metrics_chart_view;
    SQL
  end
end
