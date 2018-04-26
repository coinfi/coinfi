class EnsureNewsItemsAreUnique < ActiveRecord::Migration[5.1]
  def change
    add_index :news_items, [:feed_source_id, :feed_item_id], :unique => true
  end
end
