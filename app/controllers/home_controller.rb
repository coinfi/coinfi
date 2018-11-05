class HomeController < ApplicationController
  def index
    @coins = serialize_coins(
      Coin
        .legit
        .listed
        .page(1)
        .per(100)
        .order(:ranking)
    )
    @watched_coins = current_user.watchlist.coins.order(:ranking).pluck(:id) if current_user
  end

  def serialize_coins(coins)
    coins.as_json(
      only: %i[id name symbol slug coin_key ranking image_url price market_cap change1h change24h change7d volume24],
      methods: %i[sparkline]
    )
  end
end
