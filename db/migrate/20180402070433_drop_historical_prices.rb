class DropHistoricalPrices < ActiveRecord::Migration[5.1]
  def change
    drop_table :daily_prices
    drop_table :hourly_prices
    drop_table :histo_hours
  end
end
