class HomeController < ApplicationController
  include CoinsHelper
  include CurrencyHelper

  before_action :set_exchange_rates

  def index
    coins = Coin.listed.legit
      .page(1)
      .per(100)
      .order(:ranking)
    @page_count = coins.total_pages
    @coins = coins_serializer(coins)
    @watched_coins = current_user.watchlist.coins.order(:ranking).pluck(:id) if current_user
    @market_dominance = serialized_dominance
    @market_cap = historical_total_market_data

    set_meta_tags(
      title: "Cryptocurrency Prices Live - Crypto Market Cap, Price Charts, News & Trading Signals"
    )
  end
end
