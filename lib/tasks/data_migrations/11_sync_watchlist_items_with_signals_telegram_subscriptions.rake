namespace :data_migrations do
  desc <<~DESC
      Sync the WatchlistItems so that they reflect the current state of SignalsTelegramSubscriptions
    DESC
  task :sync_watchlist_items_with_signals_telegram_subscriptions => :environment do
    ActiveRecord::Base.transaction do
      SignalsTelegramUser.find_each do |signals_telegram_user|
        watchlist = signals_telegram_user.user.watchlist
        subscribed_coins = signals_telegram_user.subscribed_coins
        watchlist_coins = watchlist.coins

        watchlist_coins_to_add = subscribed_coins.reject do |subscribed_coin|
          # Exclude if already watched
          watchlist_coins.any? { |watchlist_coin| watchlist_coin.id == subscribed_coin.id }
        end
        watchlist_coins_to_remove = watchlist_coins.reject do |watchlist_coin|
          # Exclude if already subscribed
          subscribed_coins.any? { |subscribed_coin| subscribed_coin.id == watchlist_coin.id }
        end

        if watchlist_coins_to_add.length
          puts "Found #{watchlist_coins_to_add.length} coins to add for User(#{watchlist.user.id})"

          watchlist_coins_to_add.each do |coin|
            watchlist_item = watchlist.items.build(coin: coin)
            watchlist_item.save!
            puts "Created WatchlistItem(#{watchlist_item.id}): User(#{watchlist.user.id}) and Coin(#{coin.id})"
          end
        end

        if watchlist_coins_to_remove.length
          puts "Found #{watchlist_coins_to_remove.length} coins to remove for User(#{watchlist.user.id})"

          watchlist_coins_to_remove.each do |coin|
            watchlist_item = watchlist.items.find_by(coin: coin)
            watchlist_item.destroy!
            puts "Destroyed WatchlistItem(#{watchlist_item.id}): User(#{watchlist.user.id}) and Coin(#{coin.id})"
          end
        end
      end
    end
  end
end
