class RssController < ApplicationController
  skip_before_action :verify_authenticity_token

  RSS_URL = 'http://admin.coinfi.com/rss/'.freeze

  def daily
    # TODO: Add caching!
    xml = HTTParty.get(RSS_URL).body
    feed = Feedjira::Feed.parse xml
    entry = feed.entries.first
    @title = entry.title
    @content = entry.content.html_safe
  end


  def feed_ingest
    params[:items].each do |item|
      NewsItem.ingest!(item)
    end
    head :ok
  end
end
