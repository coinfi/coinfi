class CreateHistoHours < ActiveRecord::Migration[5.1]
  def change
    # CryptoCompare Data
    create_table :histo_hours do |t|
      t.string :from_symbol, required: true
      t.string :to_symbol, required: true
      t.integer :time
      t.decimal :close
      t.decimal :high
      t.decimal :low
      t.decimal :open
      t.decimal :volumefrom
      t.decimal :volumeto
    end

    add_index :histo_hours, :time, unique: true
    add_index :histo_hours, [:from_symbol, :to_symbol]
  end
end
