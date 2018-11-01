class DestroySignalsTelegramSubscriptionService < Patterns::Service
  attr_reader :signals_telegram_subscription
  attr_reader :watchlist_item

  def initialize(signals_telegram_subscription:)
    @signals_telegram_subscription = signals_telegram_subscription
  end

  def call
    ActiveRecord::Base.transaction do
      @signals_telegram_subscription.destroy

      coin = @signals_telegram_subscription.coin
      watchlist_item = @signals_telegram_user.user.watchlist.items.find_by(coin: @coin)
      @watchlist_item.destroy if watchlist_item
    end

    true
  end
end
