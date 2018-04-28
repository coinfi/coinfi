class AddFeedTypeAndIsSubscribedToFeedSources < ActiveRecord::Migration[5.1]
  def change
    add_column :feed_sources, :feed_type, :string
    add_column :feed_sources, :is_subscribed, :boolean, default: false
  end
end
