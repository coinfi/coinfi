class DropAhoyTables < ActiveRecord::Migration[5.1]
  def up
    drop_table :ahoy_events
    drop_table :visits
  end

  def down
    fail ActiveRecord::IrreversibleMigration
  end
end
