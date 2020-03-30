SELECT
  "coin_key",
  CAST("metrics"."date" AS date) AS "date",
  (AVG("metrics"."metric_value")) AS "number"
FROM "metrics"
JOIN "coins"
ON "metrics"."token_address" = "coins"."eth_address"
WHERE "metrics"."metric_type" = 'unique_wallet_count'
GROUP BY CAST("metrics"."date" AS date), "coin_key"
ORDER BY CAST("metrics"."date" AS date) ASC