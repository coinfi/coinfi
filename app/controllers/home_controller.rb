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
    @market_dominance = dominance
    @market_cap = Coin.historical_total_market_data
  end

  def dominance
    market_dominance = Coin.market_dominance

    # Bitcoin + top 4
    bitcoin = market_dominance.extract!('bitcoin.org').flat_map { |v| v[1] }
    other_coins = market_dominance.dup
                    .sort_by { |k, v| v[:market_percentage] }
                    .reverse[0..3]
                    .flat_map { |v| v[1] }
    coins = bitcoin + other_coins

    coins.as_json
  end

  def serialize_coins(coins)
    coins.as_json(
      only: %i[id name symbol slug coin_key ranking image_url price market_cap change1h change24h change7d volume24],
      methods: %i[sparkline]
    )
  end
end
