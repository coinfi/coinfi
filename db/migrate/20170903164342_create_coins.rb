class CreateCoins < ActiveRecord::Migration[5.1]
  def change
    create_table :coins do |t|
      t.string :name, null: false, unique: true
      t.string :symbol, null: false, unique: true
      t.string :slug, unique: true
      t.string :category
      t.jsonb :market_cap
      t.jsonb :price
      t.jsonb :volume24
      t.decimal :change1h
      t.decimal :change24h
      t.decimal :change7d
      t.bigint :available_supply
      t.bigint :max_supply
      t.string :website
      t.string :website2
      t.string :explorer
      t.string :explorer2
      t.string :forum
      t.string :forum2
      t.string :twitter
      t.string :reddit
      t.string :medium
      t.string :github
      t.string :whitepaper
      t.date :release_date
      t.string :algorithm
      t.string :proof_type
      t.string :image_url
      t.boolean :is_premined
      t.integer :tier
      t.integer :ranking
      t.integer :last_synced
      t.text :intro
      t.text :summary

      t.timestamps
    end

    add_index :coins, :slug
    add_index :coins, :category
    add_index :coins, :market_cap, using: :gin
    add_index :coins, :price, using: :gin
    add_index :coins, :volume24, using: :gin
  end
end
