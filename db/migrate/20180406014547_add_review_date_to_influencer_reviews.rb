class AddReviewDateToInfluencerReviews < ActiveRecord::Migration[5.1]
  def change
    add_column :influencer_reviews, :review_date, :datetime
  end
end
