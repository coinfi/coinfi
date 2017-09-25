class PagesController < ApplicationController
  RSS_URL = 'http://admin.coinfi.com/rss/'.freeze
  layout 'gsdk', only: [
    :home,
    :detect_whale_price_manipulation,
    :predict_coins,
    :find_relevant_news,
    :cloak_trading,
    :identify_best_priced_exchange,
    :research_bad_actors,
    :facilitate_altcoin_coverage
  ]

  def home
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

  def detect_whale_price_manipulation
  end

  def predict_coins
  end

  def find_relevant_news
  end

  def cloak_trading
  end

  def identify_best_priced_exchange
  end

  def research_bad_actors
  end

  def facilitate_altcoin_coverage
  end
end
