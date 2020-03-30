SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN vote_flag THEN vote_weight ELSE vote_weight * -1 END) AS score,
  votable_id AS id
FROM votes
WHERE votable_type = 'NewsItem'
AND updated_at >= now() - interval '1 day'
GROUP BY votable_id