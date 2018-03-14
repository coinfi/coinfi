class PagesController < ApplicationController
  RSS_URL = 'http://admin.coinfi.com/rss/'.freeze
  layout :layout_by_page

  def home
    @is_homepage = true
  end

  def prototype
  end

  def press
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

  def identify_whale_price_manipulation
  end

  def detect_coins_about_to_moon
  end

  def find_relevant_news
  end

  def display_research_pieces
  end

  def cloak_trading
  end

  def identify_best_priced_exchange
  end

  def research_bad_actors
  end

  def facilitate_altcoin_coverage
  end

  private

  def layout_by_page
    return 'application-legacy2' if ['about', 'contact', 'daily'].include? action_name
    'application-legacy'
  end

end
