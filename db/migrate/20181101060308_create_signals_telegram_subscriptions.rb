class CreateSignalsTelegramSubscriptions < ActiveRecord::Migration[5.1]
  def change
    create_table :signals_telegram_subscriptions do |t|
      t.references :signals_telegram_user, foreign_key: true, index: { name: 'index_sts_on_signals_telegram_user_id' }
      t.references :coin, foreign_key: true

      t.timestamps
    end
  end
end
