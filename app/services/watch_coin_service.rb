class WatchCoinService < Patterns::Service
  attr_reader :watchlist_item
  attr_reader :signals_telegram_subscription

  def initialize(user:, coin:)
    @user = user
    @coin = coin
  end

  def call
    result = []
    ActiveRecord::Base.transaction do
      @watchlist_item = @user.watchlist.items.build(coin: @coin)
      result << @watchlist_item.save

      if signals_telegram_user = @user.signals_telegram_user
        @signals_telegram_subscription = signals_telegram_user.signals_telegram_subscriptions.build(coin: @coin)
        result << @signals_telegram_subscription.save
      end
    end

    result.present? && result.all?
  end
end
