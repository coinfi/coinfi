class AddTokenSaleTelegramUsernameIndexToUsers < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def change
    add_index :users, "(token_sale->>'telegram_username')", :name => 'index_users_on_token_sale_telegram_username', algorithm: :concurrently
  end
end
