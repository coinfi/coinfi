class AddTitleIndexToNewsItems < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def change
    add_index :news_items, :title, algorithm: :concurrently
  end
end
