class CreateNewsTweets < ActiveRecord::Migration[5.1]
  def change
    create_table :news_tweets do |t|
      t.references :news_item, foreign_key: true, index: {unique: true}
      t.string :tweet_body
      t.json :metadata

      t.timestamps
    end
  end
end
