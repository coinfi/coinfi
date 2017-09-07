class CreateDailyPrices < ActiveRecord::Migration[5.1]
  def change
    create_table :daily_prices do |t|
      t.references :coin, foreign_key: true
      t.date :date
      t.bigint :timestamp
      t.bigint :supply
      t.jsonb :price
      t.jsonb :volume24

      t.timestamps
    end

    add_index :daily_prices, :date
    add_index :daily_prices, [:coin_id, :date], unique: true
    add_index :daily_prices, :price, using: :gin
    add_index :daily_prices, :volume24, using: :gin
  end
end
