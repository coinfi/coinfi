class CreateNewsCategories < ActiveRecord::Migration[5.1]
  def change
    create_table :news_categories do |t|
      t.string :name
      t.timestamps
    end
    add_index :news_categories, :name, unique: true

    create_table :news_item_categorizations do |t|
      t.references :news_item
      t.references :news_category
    end
  end
end
