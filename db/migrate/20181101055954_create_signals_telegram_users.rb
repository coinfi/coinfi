class CreateSignalsTelegramUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :signals_telegram_users do |t|
      t.references :user, foreign_key: true, null: true
      t.string :telegram_username, unique: true
      t.string :telegram_chat_id, unique: true
      t.datetime :started_at
      t.boolean :is_active

      t.timestamps
    end

    add_index :signals_telegram_users, :telegram_username, unique: true
    add_index :signals_telegram_users, :telegram_chat_id, unique: true
  end
end
