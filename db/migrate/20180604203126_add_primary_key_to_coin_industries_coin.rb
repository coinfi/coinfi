class AddPrimaryKeyToCoinIndustriesCoin < ActiveRecord::Migration[5.1]
  def change
    add_column :coin_industries_coins, :id, :primary_key
  end
end
