class RemoveUniqueConstraintOnCoinsName < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def up
    remove_index :coins, :name
    add_index :coins, :name
  end

  def down
    remove_index :coins, :name
    add_index :coins, :name, unique: true
  end
end
