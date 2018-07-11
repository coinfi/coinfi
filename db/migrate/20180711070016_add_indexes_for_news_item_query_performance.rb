class AddIndexesForNewsItemQueryPerformance < ActiveRecord::Migration[5.1]
  def change
    add_index :news_items, :is_published
    add_index :news_items, :feed_item_published_at
    add_index :feed_sources, :feed_type
  end
end
