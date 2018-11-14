class CreateTradingSignalTriggers < ActiveRecord::Migration[5.1]
  def change
    create_table :trading_signal_triggers do |t|
      t.string :type
      t.jsonb :params, null: false, default: {}

      t.timestamps
    end

    add_index :trading_signal_triggers, :type
  end
end
