class CreateCmcExchanges < ActiveRecord::Migration[5.1]
  def change
    create_table :cmc_exchanges do |t|
      t.string :cmc_id
      t.string :name
      t.string :slug
      t.string :www_url
      t.string :twitter_url
      t.string :blog_url
      t.string :chat_url
      t.string :fee_url
      t.string :logo_url
      t.boolean :is_active

      t.timestamps
    end

    add_index :cmc_exchanges, :cmc_id, unique: true
  end
end
