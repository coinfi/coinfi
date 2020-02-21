class CreateExchangeCategories < ActiveRecord::Migration[5.1]
  def change
    create_table :exchange_categories do |t|
      t.references :author, foreign_key: {on_delete: :cascade}
      t.string :name
      t.string :slug, null: false, index: { unique: true }
      t.string :h1
      t.string :meta_title
      t.string :meta_description
      t.text :summary
      t.text :content

      t.timestamps
    end
  end
end
