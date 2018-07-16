class CreateExchanges < ActiveRecord::Migration[5.1]
  def change
    create_table :exchanges do |t|
      t.string :ccxt_id
      t.string :name
      t.string :slug
      t.string :www_url
      t.string :logo_url

      t.timestamps
    end

    add_index :exchanges, :ccxt_id, unique: true
  end
end
