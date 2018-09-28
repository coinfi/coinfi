class AddIsActiveIndexToFeedSources < ActiveRecord::Migration[5.1]
  def change
    add_index :feed_sources, :is_active
  end
end
