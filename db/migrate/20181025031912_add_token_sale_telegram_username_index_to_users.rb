class AddTokenSaleTelegramUsernameIndexToUsers < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def up
    safety_assured do
      # Creates a triagram index to support LIKE and ILIKE operations
      execute(
        <<~SQL
          CREATE INDEX CONCURRENTLY index_users_on_token_sale_telegram_username ON users USING gin((token_sale->>'telegram_username') gin_trgm_ops);
        SQL
      )
    end
  end

  def down
    remove_index :users, name: "index_users_on_token_sale_telegram_username"
  end
end
