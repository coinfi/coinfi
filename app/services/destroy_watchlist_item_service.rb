class DestroyWatchlistItemService < Patterns::Service
  attr_reader :signals_telegram_subscription
  attr_reader :watchlist_item

  def initialize(watchlist_item:)
    @watchlist_item = watchlist_item
  end

  def call
    ActiveRecord::Base.transaction do
      @watchlist_item.destroy

      if signals_telegram_user = @watchlist_item.watchlist.user.signals_telegram_user
        @signals_telegram_subscription = signals_telegram_user.signals_telegram_subscriptions.find_by(coin_id: @coin_id)
        @signals_telegram_subscription.destroy
      end
    end

    true
  end
end
