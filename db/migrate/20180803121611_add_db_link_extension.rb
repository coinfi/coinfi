class AddDbLinkExtension < ActiveRecord::Migration[5.1]
  def up
    # Heroku already has this extension installed and does not allow for installation.
    unless Rails.env.production?
      execute <<-SQL
        CREATE extension IF NOT EXISTS dblink;
      SQL
    end
  end

  def down
    unless Rails.env.production?
      execute <<-SQL
        DROP extension IF EXISTS dblink;
      SQL
    end
  end
end
