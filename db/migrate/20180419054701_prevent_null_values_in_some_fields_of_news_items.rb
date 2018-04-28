class PreventNullValuesInSomeFieldsOfNewsItems < ActiveRecord::Migration[5.1]
  def change
    change_column_null(:news_items, :feed_item_id, false)
    change_column_null(:news_items, :feed_source_id, false)
    change_column_null(:news_items, :url, false)
    change_column_null(:news_items, :title, false)
    change_column_null(:news_items, :summary, false)
    change_column_null(:news_items, :actor_id, false)
    change_column_null(:news_items, :feed_item_published_at, false)
    change_column_null(:news_items, :feed_item_updated_at, false)
  end
end
