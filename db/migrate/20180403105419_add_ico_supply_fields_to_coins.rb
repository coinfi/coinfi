class AddIcoSupplyFieldsToCoins < ActiveRecord::Migration[5.1]
  def change
    add_column :coins, :ico_max_supply, :bigint
    add_column :coins, :ico_available_supply, :bigint
  end
end
