class CreateArticles < ActiveRecord::Migration[5.1]
  def change
    create_table :articles do |t|
      t.references :coin, foreign_key: true
      t.string :url
      t.string :title
      t.text :summary
      t.datetime :published_date
      t.bigint :published_epoch
      t.decimal :importance

      t.timestamps
    end

    add_index :articles, :importance
  end
end
