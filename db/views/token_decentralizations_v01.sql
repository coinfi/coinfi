select
  rank() over(order by metrics.metric_value desc) as rank,
  sum(1) over() as num_coins,
  metrics.metric_value * 100.0 as metric_value,
  coalesce(100.0 * (metrics.metric_value / nullif(metrics.metrics_1d_before, 0) - 1), 0.0) as change_1d,
  coalesce(100.0 * (metrics.metric_value / nullif(metrics.metrics_7d_before, 0) - 1), 0.0) as change_7d,
  coalesce(100.0 * (metrics.metric_value / nullif(metrics.metrics_30d_before, 0) - 1), 0.0) as change_30d,
  coins.coin_key
from (
    select
    token_address,
    metric_value,
    lead(1) over w as metrics_1d_before,
    lead(7) over w as metrics_7d_before,
    lead(30) over w as metrics_30d_before
  from metrics
  where metric_type = 'token_distribution_100'
  and metrics.date = (select max(date) from metrics where metric_type = 'token_distribution_100')
  window w as (order by date desc)
) metrics
join coins on metrics.token_address = coins.eth_address