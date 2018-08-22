class EnforceUniqueExchangeAndSymbolOnExchangeListings < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def change
    add_index :exchange_listings, [:exchange_id, :symbol], unique: true, algorithm: :concurrently
  end
end
