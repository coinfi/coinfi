class FixHistoHourIndexes < ActiveRecord::Migration[5.1]
  def change
    remove_index :histo_hours, :time
    remove_index :histo_hours, [:from_symbol, :to_symbol]
    add_index :histo_hours, :time
    add_index :histo_hours, :from_symbol
  end
end
