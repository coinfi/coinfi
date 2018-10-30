class AddNewsItemIdIndexToNewsItemRaws < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def change
    add_index :news_item_raws, :news_item_id, algorithm: :concurrently
  end
end
