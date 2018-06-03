class RemoveColumnCoinIdsFromNewsItems < ActiveRecord::Migration[5.1]
  def change
    remove_column :news_items, :coin_ids, :jsonb
  end
end
