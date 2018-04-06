class RenameCoinsWatchlistsToWatchlistItems < ActiveRecord::Migration[5.1]
  def up
    rename_table :coins_watchlists, :watchlist_items
    add_column :watchlist_items, :id, :primary_key
    add_column :watchlist_items, :position, :integer, default: 0
    add_index :watchlist_items, :position
  end
  def down
    rename_table :watchlist_items, :coins_watchlists
    remove_column :coins_watchlists, :position
    remove_column :coins_watchlists, :id
  end
end
