class RemoveNullConstraintOnCoins < ActiveRecord::Migration[5.1]
  def up
    change_column :coins, :symbol, :string, null: true
  end
  def down
    change_column :coins, :symbol, :string, null: false
  end
end
