class CreateMentions < ActiveRecord::Migration[5.1]
  def change
    create_table :mentions do |t|
      t.references :coin, foreign_key: true
      t.references :news_item, foreign_key: true
    end
  end
end
