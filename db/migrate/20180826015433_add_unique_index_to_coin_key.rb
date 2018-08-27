class AddUniqueIndexToCoinKey < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def up
    remove_index :coins, :coin_key
    add_index :coins, :coin_key, unique: true, algorithm: :concurrently
  end

  def down
    remove_index :coins, :coin_key
    add_index :coins, :coin_key, algorithm: :concurrently
  end
end
