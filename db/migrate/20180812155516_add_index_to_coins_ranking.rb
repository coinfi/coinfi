class AddIndexToCoinsRanking < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def change
    add_index :coins, :ranking, algorithm: :concurrently
  end
end
