class CreateInfluencers < ActiveRecord::Migration[5.1]
  def change
    create_table :influencers do |t|
      t.string :name
      t.string :website

      t.timestamps
    end
  end
end
