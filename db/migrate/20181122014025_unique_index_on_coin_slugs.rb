class UniqueIndexOnCoinSlugs < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def up
    remove_index :coins, :slug
    add_index :coins, :slug, unique: true, algorithm: :concurrently
  end

  def down
    remove_index :coins, :slug
    add_index :coins, :slug, algorithm: :concurrently
  end
end
