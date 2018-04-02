class CreateInfluencerReviews < ActiveRecord::Migration[5.1]
  def change
    create_table :influencer_reviews do |t|
      t.references :coin, foreign_key: {on_delete: :cascade}
      t.references :influencer, foreign_key: {on_delete: :cascade}
      t.string :url
      t.string :rating
      t.text :review

      t.timestamps
    end
  end
end
