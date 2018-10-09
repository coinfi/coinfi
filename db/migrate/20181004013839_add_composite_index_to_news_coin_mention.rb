class AddCompositeIndexToNewsCoinMention < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def change
    reversible do |dir|
      dir.up do
        # remove duplicates
        safety_assured {
          execute <<-SQL
            DELETE FROM news_coin_mentions AS T1 
              USING news_coin_mentions AS T2 
                WHERE T1.ctid < T2.ctid 
                AND T1.coin_id = T2.coin_id 
                AND T1.news_item_id = T2.news_item_id 
                AND T1.is_machine_tagged = T2.is_machine_tagged;
          SQL
        }
      end
    end

    add_index :news_coin_mentions, [:news_item_id, :coin_id], algorithm: :concurrently
    add_index :news_coin_mentions, [:news_item_id, :coin_id, :is_machine_tagged], unique: true, :name => 'unique_index_news_coin_mention', algorithm: :concurrently
  end
end
