class AddCachedVotesToNewsItems < ActiveRecord::Migration[4.2]
  def change
    safety_assured do
      change_table :news_items do |t|
        t.integer :cached_votes_total, default: 0
        t.integer :cached_votes_score, default: 0
        t.integer :cached_votes_up, default: 0
        t.integer :cached_votes_down, default: 0
        t.integer :cached_weighted_score, default: 0
        t.integer :cached_weighted_total, default: 0
        t.float :cached_weighted_average, default: 0.0
      end
    end
  end
end
