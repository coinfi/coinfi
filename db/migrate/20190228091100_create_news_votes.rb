class CreateNewsVotes < ActiveRecord::Migration[5.1]
  def change
    create_table :news_votes do |t|
      t.references :news_item, foreign_key: true
      t.references :user, foreign_key: true
      t.integer :vote
      t.timestamps
    end

    add_index :news_votes, [:news_item_id, :user_id], unique: true
  end
end