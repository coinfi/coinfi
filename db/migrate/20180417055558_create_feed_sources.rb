class CreateFeedSources < ActiveRecord::Migration[5.1]
  def change
    create_table :feed_sources do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.string :feed_url, null: false
      t.string :site_url, null: false
      t.timestamps
    end

    add_index :feed_sources, :name, unique: true
    add_index :feed_sources, :feed_url, unique: true
  end
end
