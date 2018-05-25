class CreateNewsCoinMentions < ActiveRecord::Migration[5.1]
  def up
    create_table :news_coin_mentions do |t|
      t.references :coin
      t.references :news_item
    end
    puts "Created news_coin_mentions"
    NewsItem.all.each do |ni|
      ni.coin_ids.each do |coin_id|
        NewsCoinMention.create!(coin_id: coin_id, news_item_id: ni.id)
      end
    end
    puts "Populated news_coin_mentions using IDs from news_items.coin_ids"
    remove_column :news_items, :coin_ids
    puts "Removed news_items.coin_ids"
    puts "✨"
  end
  def down
    drop_table :news_coin_mentions
  end
end
