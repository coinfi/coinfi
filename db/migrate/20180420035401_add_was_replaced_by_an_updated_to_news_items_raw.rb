class AddWasReplacedByAnUpdatedToNewsItemsRaw < ActiveRecord::Migration[5.1]
  def change
    add_column :news_item_raws, :was_replaced_by_an_update, :boolean
  end
end
