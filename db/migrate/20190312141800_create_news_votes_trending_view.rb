class CreateNewsVotesTrendingView < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def up
    safety_assured do
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
        CREATE UNIQUE INDEX CONCURRENTLY index_news_votes_trending_view ON news_votes_trending_view(id);
      SQL
    end
  end

  def down
    safety_assured do
      execute <<-SQL
        DROP MATERIALIZED VIEW news_votes_trending_view;
      SQL
    end
  end
end