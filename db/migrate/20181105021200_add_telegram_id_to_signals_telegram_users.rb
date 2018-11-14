class AddTelegramIdToSignalsTelegramUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :signals_telegram_users, :telegram_id, :string, unique: true, index: true
  end
end
