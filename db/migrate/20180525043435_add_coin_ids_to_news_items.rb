class AddCoinIdsToNewsItems < ActiveRecord::Migration[5.1]
  def change
    add_column :news_items, :coin_ids, :jsonb
  end
end
