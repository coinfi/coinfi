class ChangeIcoTokenPriceUsdDecimals < ActiveRecord::Migration[5.1]
  def up
    safety_assured do
      change_column :coins, :ico_token_price_usd, :decimal, precision: 24, scale: 16
    end
  end

  def down
    safety_assured do
      change_column :coins, :ico_token_price_usd, :decimal, precision: 10, scale: 2
    end
  end
end
