class CreateTradingSignals < ActiveRecord::Migration[5.1]
  def change
    create_table :trading_signals do |t|
      t.string :external_id
      t.references :trading_signal_trigger, foreign_key: true
      t.jsonb :extra, null: false, default: {}
      t.timestamp :timestamp

      t.timestamps
    end
  end
end
