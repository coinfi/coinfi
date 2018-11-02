class UnwatchCoinService < Patterns::Service
  attr_reader :watchlist_item
  attr_reader :signals_telegram_subscription

  def initialize(user:, coin:)
    @user = user
    @coin = coin
  end

  def call
    ActiveRecord::Base.transaction do
      @watchlist_item = @user.watchlist.items.find_by(coin: @coin)
      @watchlist_item.destroy if watchlist_item

      if signals_telegram_user = @user.signals_telegram_user
        @signals_telegram_subscription = signals_telegram_user.signals_telegram_subscriptions.find_by(coin: @coin)
        @signals_telegram_subscription.destroy if @signals_telegram_subscription
      end
    end

    true
  end
end
