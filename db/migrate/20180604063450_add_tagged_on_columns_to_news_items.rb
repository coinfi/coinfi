class AddTaggedOnColumnsToNewsItems < ActiveRecord::Migration[5.1]
  def change
    add_column :news_items, :last_human_tagged_on, :datetime
    add_column :news_items, :last_machine_tagged_on, :datetime
    add_reference :news_items, :user, foreign_key: true
  end
end
