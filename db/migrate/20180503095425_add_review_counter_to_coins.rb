class AddReviewCounterToCoins < ActiveRecord::Migration[5.1]
  def change
    add_column :coins, :influencer_reviews_count, :integer
    add_index :coins, :influencer_reviews_count
  end
end
