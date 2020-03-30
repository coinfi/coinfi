class MigrateViewsToScenic < ActiveRecord::Migration[5.1]
  def up
    safety_assured do
      execute <<-SQL
        DROP MATERIALIZED VIEW news_votes_trending_view;
      SQL

      execute <<-SQL
        DROP MATERIALIZED VIEW exchange_supply_view;
      SQL

      execute <<-SQL
        DROP MATERIALIZED VIEW token_retention_rate_view;
      SQL

      execute <<-SQL
        DROP MATERIALIZED VIEW unique_wallet_count_view;
      SQL

      execute <<-SQL
        DROP MATERIALIZED VIEW token_distribution_100_view;
      SQL

      execute <<-SQL
        DROP MATERIALIZED VIEW token_velocity_view;
      SQL

      execute <<-SQL
        DROP MATERIALIZED VIEW metrics_chart_view;
      SQL
    end

    create_view :news_votes_trendings, materialized: true
    create_view :token_supplies, materialized: true
    create_view :token_retentions, materialized: true
    create_view :token_adoptions, materialized: true
    create_view :token_decentralizations, materialized: true
    create_view :token_velocities, materialized: true
    create_view :daily_token_supplies, materialized: true
    create_view :daily_token_retentions, materialized: true
    create_view :daily_token_adoptions, materialized: true
    create_view :daily_token_decentralizations, materialized: true
    create_view :daily_token_velocities, materialized: true
  end

  def down
    drop_view :news_votes_trendings, materialized: true
    drop_view :token_supplies, materialized: true
    drop_view :token_retentions, materialized: true
    drop_view :token_adoptions, materialized: true
    drop_view :token_decentralizations, materialized: true
    drop_view :token_velocities, materialized: true
    drop_view :daily_token_supplies, materialized: true
    drop_view :daily_token_retentions, materialized: true
    drop_view :daily_token_adoptions, materialized: true
    drop_view :daily_token_decentralizations, materialized: true
    drop_view :daily_token_velocities, materialized: true

    safety_assured do
      execute <<-SQL
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

      execute <<-SQL
        CREATE UNIQUE INDEX index_exchange_supply_view ON exchange_supply_view(coin_key);
      SQL

      execute <<-SQL
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

      execute <<-SQL
        CREATE UNIQUE INDEX index_token_retention_rate_view ON token_retention_rate_view(coin_key);
      SQL

      execute <<-SQL
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

      execute <<-SQL
        CREATE UNIQUE INDEX index_unique_wallet_count_view ON unique_wallet_count_view(coin_key);
      SQL

      execute <<-SQL
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

      execute <<-SQL
        CREATE UNIQUE INDEX index_token_distribution_100_view ON token_distribution_100_view(coin_key);
      SQL

      execute <<-SQL
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
        WHERE metrics_after.metric_type = 'token_velocity'
        AND metrics_after.date = (select max(date) FROM metrics)
        WITH DATA;
      SQL

      execute <<-SQL
        CREATE UNIQUE INDEX index_token_velocity_view ON token_velocity_view(coin_key);
      SQL

      execute <<-SQL
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

      execute <<-SQL
        CREATE UNIQUE INDEX index_metrics_chart_view ON metrics_chart_view(metric_type, coin_key, date);
      SQL

      execute <<-SQL
        CREATE MATERIALIZED VIEW news_votes_trending_view AS SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN vote_flag THEN vote_weight ELSE vote_weight * -1 END) AS score,
          votable_id AS id
        FROM votes
        WHERE votable_type = 'NewsItem'
        AND updated_at >= now() - interval '1 day'
        GROUP BY votable_id
        WITH DATA;
      SQL

      execute <<-SQL
        CREATE UNIQUE INDEX index_news_votes_trending_view ON news_votes_trending_view(id);
      SQL
    end
  end
end
