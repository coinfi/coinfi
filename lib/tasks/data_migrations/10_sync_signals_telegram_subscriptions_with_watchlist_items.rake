#
namespace :data_migrations do
  desc <<~DESC
      Sync the SignalsTelegramSubscriptions so that they reflect the current state of WatchlistItems
    DESC
  task :sync_signals_telegram_subscriptions_with_watchlist_items => :environment do
    ActiveRecord::Base.transaction do
      signals_telegram_subscription_destroy_count = SignalsTelegramSubscription.count
      SignalsTelegramSubscription.destroy_all
      puts "Destroyed #{signals_telegram_subscription_destroy_count} SignalsTelegramSubscriptions"

      watchlist_items = WatchlistItem.joins(:watchlist => { :user => :signals_telegram_user })
      watchlist_items.find_each do |watchlist_item|
        user = watchlist_item.watchlist.user
        coin = watchlist_item.coin
        signals_telegram_user = user.signals_telegram_user

        signals_telegram_subscription = signals_telegram_user.signals_telegram_subscriptions.build(
          coin: coin,
        )
        signals_telegram_subscription.save!
        puts "Created SignalsTelegramSubscription(#{signals_telegram_subscription.id}): @#{signals_telegram_user.telegram_username} #{coin.slug}"
      end
    end
  end
end
