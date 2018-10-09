class AddIsActiveIndexToFeedSources < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def change
    add_index :feed_sources, :is_active, algorithm: :concurrently
  end
end
