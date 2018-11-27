class AddTokenDecimalsToCoins < ActiveRecord::Migration[5.1]
  def change
    add_column :coins, :token_decimals, :integer
  end
end
