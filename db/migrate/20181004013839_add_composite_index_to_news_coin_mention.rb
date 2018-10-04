class AddCompositeIndexToNewsCoinMention < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def change
    add_index :news_coin_mentions, [:news_item_id, :coin_id], algorithm: :concurrently
    add_index :news_coin_mentions, [:news_item_id, :coin_id, :is_machine_tagged], unique: true, :name => 'unique_index_news_coin_mention', algorithm: :concurrently
  end
end
