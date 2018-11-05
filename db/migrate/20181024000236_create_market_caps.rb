class CreateMarketCaps < ActiveRecord::Migration[5.1]
  def change
    create_table :market_caps do |t|
      t.decimal :total_market_cap, precision: 18, scale: 2

      t.timestamps
    end
    add_index :market_caps, :created_at
  end
end
