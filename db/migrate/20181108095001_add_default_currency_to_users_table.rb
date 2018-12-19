class AddDefaultCurrencyToUsersTable < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :default_currency, :string
  end
end
