class CreateTradingSignals < ActiveRecord::Migration[5.1]
  def change
    create_table :trading_signals do |t|
      t.string :external_id, unique: true, index: true
      t.references :trading_signal_trigger, foreign_key: true
      t.string :trading_signal_trigger_external_id, index: { name: 'index_ts_on_trading_signal_trigger_external_id' }
      t.jsonb :extra
      t.timestamp :timestamp

      t.timestamps
    end
  end
end
