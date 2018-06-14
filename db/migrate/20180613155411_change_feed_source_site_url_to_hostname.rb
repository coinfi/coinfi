class ChangeFeedSourceSiteUrlToHostname < ActiveRecord::Migration[5.1]
  def up
    rename_column :feed_sources, :site_url, :site_hostname
    FeedSource.where(feed_type: 'general').each do |feed_source|
      next unless feed_source.site_hostname.include?('http')
      feed_source.update(site_hostname: URI.parse(feed_source.site_hostname).host || '')
    end
  end
  def down
    rename_column :feed_sources, :site_hostname, :site_url
  end
end
