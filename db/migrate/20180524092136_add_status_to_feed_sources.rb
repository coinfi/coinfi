class AddStatusToFeedSources < ActiveRecord::Migration[5.1]
  def change
    add_column :feed_sources, :is_active, :boolean, default: true
  end
end
