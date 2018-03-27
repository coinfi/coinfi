class ChangeCoinIcoColumns < ActiveRecord::Migration[5.1]
  def change
    add_column :coins, :ico_personal_cap_min, :string
    add_column :coins, :ico_personal_cap_max, :string
  end
end
