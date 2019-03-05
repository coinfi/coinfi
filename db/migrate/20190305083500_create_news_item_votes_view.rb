class CreateNewsItemVotesView < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def up
    safety_assured do
      execute <<-SQL
        CREATE OR REPLACE VIEW news_item_votes_view AS SELECT
          news_item_id,
          coalesce(sum(vote), 0) as total
        FROM news_votes
        WHERE vote != 0
        GROUP BY news_item_id;
      SQL
    end
  end

  def down
    safety_assured do
      execute <<-SQL
        DROP VIEW news_item_votes_view;
      SQL
    end
  end
end