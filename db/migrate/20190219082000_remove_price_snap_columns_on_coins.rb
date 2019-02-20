class RemovePriceSnapColumnsOnCoins < ActiveRecord::Migration[5.1]
  def change
    safety_assured {
      remove_column :coins, :market_cap
      remove_column :coins, :price
      remove_column :coins, :volume24
      remove_column :coins, :change1h
      remove_column :coins, :change24h
      remove_column :coins, :change7d
      remove_column :coins, :available_supply
      remove_column :coins, :max_supply
      remove_column :coins, :total_supply
    }
  end
end
