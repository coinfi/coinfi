class CreateInfluencers < ActiveRecord::Migration[5.1]
  def change
    create_table :influencers do |t|
      t.references :coin, foreign_key: true
      t.string :influencer
      t.string :url
      t.string :rating
      t.text :review

      t.timestamps
    end
  end
end
