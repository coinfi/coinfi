class HomeController < ApplicationController
  include CoinsHelper

  def index
    @hide_currency = true

    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      coins = Coin.listed.legit
        .page(1)
        .per(100)
        .order(:ranking)
      @page_count = coins.total_pages
      @coins = coins_serializer(coins)
      @watched_coins = current_user.watchlist.coins.order(:ranking).pluck(:id) if current_user
      @market_dominance = serialized_dominance
      @market_cap = historical_total_market_data
    end
  end
end