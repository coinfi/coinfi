class CreateCoinArticles < ActiveRecord::Migration[5.1]
  def change
    create_table :coin_articles do |t|
      t.references :coin, foreign_key: {on_delete: :cascade}
      t.references :author, foreign_key: {on_delete: :cascade}
      t.string :slug
      t.string :title
      t.string :meta_title
      t.string :meta_description
      t.text :summary
      t.text :content

      t.timestamps
    end
  end
end
