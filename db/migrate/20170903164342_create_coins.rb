class CreateCoins < ActiveRecord::Migration[5.1]
  def change
    create_table :coins do |t|
      t.string :name
      t.string :symbol
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
      t.integer :tier
      t.date :release_date
      t.text :consensus_method
      t.text :intro
      t.text :summary

      t.timestamps
    end
  end
end
