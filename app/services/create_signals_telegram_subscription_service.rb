class CreateSignalsTelegramSubscriptionService < Patterns::Service
  attr_reader :signals_telegram_subscription
  attr_reader :watchlist_item

  def initialize(signals_telegram_user:, coin:)
    @signals_telegram_user = signals_telegram_user
    @coin = coin
  end

  def call
    result = []
    ActiveRecord::Base.transaction do
      @signals_telegram_subscription = @signals_telegram_user.signals_telegram_subscriptions.build(coin: @coin)
      result << @signals_telegram_subscription.save

      @watchlist_item = @signals_telegram_user.user.watchlist.items.build(coin: @coin)
      result << @watchlist_item.save
    end

    result.all?
  end
end
