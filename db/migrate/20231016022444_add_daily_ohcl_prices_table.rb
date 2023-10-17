class AddDailyOhclPricesTable < ActiveRecord::Migration[5.2]
  def change
    create_table :daily_ohcl_prices do |t|
      t.references :coin, foreign_key: true
      t.string :to_currency, default: 'USD'
      t.datetime :time
      t.numeric :open
      t.numeric :high
      t.numeric :low
      t.numeric :close
      t.numeric :volume_to
    end
    add_index :daily_ohcl_prices, [:coin_id, :to_currency, :time], unique: true
  end
end
