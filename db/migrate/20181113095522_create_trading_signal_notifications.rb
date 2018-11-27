class CreateTradingSignalNotifications < ActiveRecord::Migration[5.1]
  def change
    create_table :trading_signal_notifications do |t|
      t.string :external_id, unique: true, index: true
      t.references :trading_signal, foreign_key: true
      t.string :trading_signal_external_id, index: { name: 'index_tsn_on_trading_signal_external_id' }
      t.references :user, foreign_key: true
      t.jsonb :extra
      t.timestamp :timestamp

      t.timestamps
    end
  end
end
