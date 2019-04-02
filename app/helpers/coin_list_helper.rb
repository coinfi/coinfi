module CoinListHelper
  TOP_LIST_LIMIT = 20

  def toplist_coins(force_cache_refresh: false)
    serialized_coins = Rails.cache.fetch("coins/toplist", expires_in: 1.hour, force: force_cache_refresh) do
      distribute_reads(max_lag: ApplicationController::MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
        coins = Coin.order(:ranking).limit(TOP_LIST_LIMIT)
        coinlist_serializer(coins)
      end
    end
    serialized_coins
  end

  def is_toplist_coin?(coin)
    coin && coin.try(:ranking) <= TOP_LIST_LIMIT
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
      only: %i[id name symbol slug],
      methods: %i[market_info]
    )
  end
end
