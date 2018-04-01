class CreateWatchlist < ActiveRecord::Migration[5.1]
  def change
    create_table :watchlists do |t|
      t.references :user
    end
    create_join_table :watchlists, :coins do |t|
      t.index :watchlist_id
      t.index :coin_id
    end
  end
end
