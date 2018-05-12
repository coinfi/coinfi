class CreateCoinIndustry < ActiveRecord::Migration[5.1]
  def change
    create_table :coin_industries do |t|
      t.string :name
      t.timestamps
    end
    add_index :coin_industries, :name, unique: true
    create_join_table :coins, :coin_industries do |t|
      t.index :coin_id
      t.index :coin_industry_id
    end
  end
end
