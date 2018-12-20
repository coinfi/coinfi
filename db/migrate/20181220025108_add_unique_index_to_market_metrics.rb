class AddUniqueIndexToMarketMetrics < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def change
    remove_index :market_metrics, :timestamp
    add_index :market_metrics, :timestamp, unique: true, algorithm: :concurrently
  end
end
