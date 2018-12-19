class CreateMarketMetrics < ActiveRecord::Migration[5.1]
  def change
    create_table :market_metrics do |t|
      t.decimal :total_market_cap, precision: 18, scale: 2, null: false
      t.decimal :total_volume_24h, precision: 18, scale: 2
      t.datetime :timestamp, null: false
    end
    add_index :market_metrics, :timestamp
  end
end