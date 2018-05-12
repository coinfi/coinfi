class AddCoinIdToFeedSources < ActiveRecord::Migration[5.1]
  def change
    add_reference :feed_sources, :coin, foreign_key: true
  end
end
