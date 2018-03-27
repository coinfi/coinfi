class ChangeCoinIcoColumns < ActiveRecord::Migration[5.1]
  def change
    change_column :coins, :ico_personal_cap_usd_min, :string
    change_column :coins, :ico_personal_cap_usd_max, :string
  end
end
