class CreateExchangeListings < ActiveRecord::Migration[5.1]
  def change
    create_table :exchange_listings do |t|
      t.references :exchange, foreign_key: true
      t.string :ccxt_exchange_id
      t.string :symbol
      t.string :quote_symbol
      t.references :quote_symbol, foreign_key: { to_table: :coins }
      t.string :base_symbol
      t.references :base_symbol, foreign_key: { to_table: :coins }
      t.datetime :detected_at

      t.timestamps
    end

    add_index :exchange_listings, :quote_symbol
    add_index :exchange_listings, :detected_at
  end
end
