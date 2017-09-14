class CreateHourlyPrices < ActiveRecord::Migration[5.1]
  def change
    create_table :hourly_prices do |t|
      t.references :coin, foreign_key: true
      t.datetime :datetime
      t.bigint :timestamp
      t.bigint :supply
      t.jsonb :price
      t.jsonb :volume24

      t.timestamps
    end

    add_index :hourly_prices, [:coin_id, :datetime], unique: true
    add_index :hourly_prices, :price, using: :gin
    add_index :hourly_prices, :volume24, using: :gin
  end
end
