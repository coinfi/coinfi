class CreateNewsItems < ActiveRecord::Migration[5.1]
  def change
    create_table :news_items do |t|
      t.references :feed_source
      t.string :feed_item_id
      t.string :url
      t.string :title
      t.text :summary
      t.text :content
      t.string :actor_id
      t.datetime :feed_item_published_at
      t.datetime :feed_item_updated_at
      t.jsonb :feed_item_json
      t.string :websub_hub #superfeedr

      t.integer :importance, default: 0
      t.boolean :is_published, default: true
      t.boolean :is_processed, default: false

      t.timestamps
    end
  end
end
