class CreateDailyPrices < ActiveRecord::Migration[5.1]
  def change
    create_table :daily_prices do |t|
      t.references :coin, foreign_key: true
      t.date :date
      t.integer :timestamp
      t.bigint :supply
      t.decimal :usd_price
      t.decimal :usd_volume
      t.decimal :btc_price
      t.decimal :btc_volume
      t.decimal :eur_price
      t.decimal :eur_volume
      t.decimal :cny_price
      t.decimal :cny_volume
      t.decimal :gbp_price
      t.decimal :gbp_volume
      t.decimal :rub_price
      t.decimal :rub_volume
      t.decimal :hkd_price
      t.decimal :hkd_volume
      t.decimal :jpy_price
      t.decimal :jpy_volume
      t.decimal :aud_price
      t.decimal :aud_volume

      t.timestamps
    end

    add_index :daily_prices, :date
    add_index :daily_prices, [:coin_id, :date], unique: true
  end
end
