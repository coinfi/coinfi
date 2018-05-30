class AddIsHumanTaggedToNewsItems < ActiveRecord::Migration[5.1]
  def change
    add_column :news_items, :is_human_tagged, :boolean
  end
end
