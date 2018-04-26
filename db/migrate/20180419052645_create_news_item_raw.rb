class CreateNewsItemRaw < ActiveRecord::Migration[5.1]
  def change
    create_table :news_item_raws do |t|
      t.string :feed_item_id
      t.string :source
      t.string :websub_hub
      t.jsonb :feed_item_json
      t.boolean :is_processed, default: false
      t.integer :news_item_id
    end

    remove_column :news_items, :is_processed, :boolean, default: false
  end
end
