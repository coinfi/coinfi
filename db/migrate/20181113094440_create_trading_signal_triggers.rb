class CreateTradingSignalTriggers < ActiveRecord::Migration[5.1]
  def change
    create_table :trading_signal_triggers do |t|
      t.string :external_id, unique: true, index: true
      t.string :type_key, index: true
      t.jsonb :params

      t.timestamps
    end
  end
end
