class ChangeFeedSourceSiteUrlToHostname < ActiveRecord::Migration[5.1]
  def change
    rename_column :feed_sources, :site_url, :site_hostname
    FeedSource.where(feed_type: 'general').each do |feed_source|
      feed_source.update(site_hostname: URI.parse(feed_source.site_hostname).host || '')
    end
  end
end
