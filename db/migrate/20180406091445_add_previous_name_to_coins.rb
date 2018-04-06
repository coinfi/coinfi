class AddPreviousNameToCoins < ActiveRecord::Migration[5.1]
  def change
    add_column :coins, :previous_name, :string
  end
end
