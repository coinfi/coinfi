class PagesController < ApplicationController
  RSS_URL = 'http://admin.coinfi.com/rss/'.freeze

  def home
    render layout: false
  end

  def about
  end

  def contact
  end

  def daily
    # TODO: Add caching!
    xml = HTTParty.get(RSS_URL).body
    feed = Feedjira::Feed.parse xml
    entry = feed.entries.first
    @title = entry.title
    @content = entry.content.html_safe
  end
end
