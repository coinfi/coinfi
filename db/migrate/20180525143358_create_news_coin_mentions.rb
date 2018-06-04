class CreateNewsCoinMentions < ActiveRecord::Migration[5.1]
  def change
    create_table :news_coin_mentions do |t|
      t.references :coin
      t.references :news_item
    end
  end
end
