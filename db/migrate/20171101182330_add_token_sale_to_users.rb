class AddTokenSaleToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :token_sale, :jsonb
  end
end
