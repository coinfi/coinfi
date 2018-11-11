class SignalsTelegramBot::WatchCoinForm < Patterns::Form
  attr_reader :service

  param_key 'watch_coin_form'

  attribute :signals_telegram_user
  attribute :coin_symbol

  validates :signals_telegram_user, presence: true
  validates :coin_symbol, presence: true
  validates :coin, presence: true, :if => proc { |f| f.coin_symbol.present? }
  validates :signals_telegram_subscription, absence: true, :if => proc { |f| f.signals_telegram_user.present? && f.coin.present? }
  validate :validate_signals_telegram_subscriptions_count, :if => proc { |f| f.signals_telegram_user.present? }

  def persist
    @service = WatchCoinService.new(
      user: signals_telegram_user.user,
      coin: coin,
    )
    @service.call
  end

  protected

  def validate_signals_telegram_subscriptions_count
    max_signals_telegram_subscriptions_count = ENV.fetch('SIGNALS_MAX_WATCHLIST_ITEMS').to_i

    # Check the `count + 1` because we have not yet appended the new record to the collection and
    # will not append until after `persist`
    signals_telegram_subscriptions_count = signals_telegram_subscriptions.count
    if signals_telegram_subscriptions_count + 1 > max_signals_telegram_subscriptions_count
      errors.add(
        :signals_telegram_subscriptions,
        :length,
        current: signals_telegram_subscriptions_count,
        maximum: max_signals_telegram_subscriptions_count,
        message: "cannot contain more than #{max_signals_telegram_subscriptions_count} coins"
      )
    end
  end

  def signals_telegram_subscriptions
    signals_telegram_user.signals_telegram_subscriptions
  end

  def signals_telegram_subscription
    @signals_telegram_subscription ||= signals_telegram_subscriptions
      .find_by(coin: coin)
  end

  def coin
    @coin ||= Coin.order(ranking: :asc).find_by(symbol: coin_symbol.upcase)
  end
end
