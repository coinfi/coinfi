class CreateCoinExcludedCountries < ActiveRecord::Migration[5.1]
  def change
    create_table :coin_excluded_countries do |t|
      t.references :coin, foreign_key: true
      t.references :country, foreign_key: true
      t.text :notes

      t.timestamps
    end
  end
end
