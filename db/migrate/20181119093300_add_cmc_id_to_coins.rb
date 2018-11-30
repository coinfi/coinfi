class AddCmcIdToCoins < ActiveRecord::Migration[5.1]
  def change
    add_column :coins, :cmc_id, :integer
  end
end
