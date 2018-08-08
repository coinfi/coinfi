class AddDbLinkExtension < ActiveRecord::Migration[5.1]
  def up
    execute <<-SQL
      CREATE extension IF NOT EXISTS dblink;
    SQL
  end

  def down
    execute <<-SQL
      DROP extension IF EXISTS dblink;
    SQL
  end
end
