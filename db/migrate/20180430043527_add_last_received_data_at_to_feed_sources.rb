class AddLastReceivedDataAtToFeedSources < ActiveRecord::Migration[5.1]
  def change
    add_column :feed_sources, :last_received_data_at, :datetime
  end
end
