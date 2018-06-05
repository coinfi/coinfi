class AddIsMachineTaggedToNewsCoinMentions < ActiveRecord::Migration[5.1]
  def change
    add_column :news_coin_mentions, :is_machine_tagged, :boolean, default: false
    add_index :news_coin_mentions, :is_machine_tagged
  end
end
