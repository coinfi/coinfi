class CreateWatchlistItemService < Patterns::Service
  attr_reader :watchlist_item
  attr_reader :signals_telegram_subscription

  def initialize(watchlist:, coin_id:)
    @watchlist = watchlist
    @coin_id = coin_id
  end

  def call
    result = []
    ActiveRecord::Base.transaction do
      @watchlist_item = @watchlist.items.build(coin_id: @coin_id)
      result << @watchlist_item.save

      if signals_telegram_user = @watchlist.user.signals_telegram_user
        @signals_telegram_subscription = signals_telegram_user.signals_telegram_subscriptions.build(coin_id: @coin_id)
        result << @signals_telegram_subscription.save
      end
    end

    result.all?
  end
end
