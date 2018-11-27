class ChangeTotalSupplyToDecimal < ActiveRecord::Migration[5.1]
  def up
    safety_assured do
      change_column :coins, :total_supply, :decimal, precision: 32, scale: 2
    end
  end

  def down
    safety_assured do
      change_column :coins, :total_supply, :bigint
    end
  end
end
