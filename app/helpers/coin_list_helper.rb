module CoinListHelper
  def toplist_coins
    distribute_reads(max_lag: ApplicationController::MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      serialized_coins = Rails.cache.fetch("coins/toplist", expires_in: 1.hour) do
        coins = Coin.order(:ranking).limit(20)
        coinlist_serializer(coins)
      end
      serialized_coins
    end
  end

  def watchlist_coins
    unless current_user
      return []
    end

    distribute_reads(max_lag: ApplicationController::MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      coins = current_user.watchlist.coins.order(:ranking)
      coinlist_serializer(coins)
    end
  end

  def coinlist_serializer(coins)
    coins.as_json(
      only: %i[id name symbol slug price_usd],
      methods: %i[market_info]
    )
  end
end
