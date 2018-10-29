class AddTokenSaleSignalsTelegramBotChatIdIndexToUsers < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def change
    add_index :users, "(token_sale->>'signals_telegram_bot_chat_id')", :name => 'index_users_on_token_sale_signals_telegram_bot_chat_id', algorithm: :concurrently
  end
end
