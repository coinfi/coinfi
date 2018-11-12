class SignalsTelegramBot::UnwatchCoinForm < Patterns::Form
  attr_reader :service

  param_key 'unwatch_coin_form'

  attribute :signals_telegram_user
  attribute :coin_symbol

  validates :signals_telegram_user, presence: true
  validates :coin_symbol, presence: true
  validates :signals_telegram_subscription, presence: true, :if => proc { |f| f.signals_telegram_user.present? && f.coin_symbol.present? }

  def persist
    @service = UnwatchCoinService.new(
      user: signals_telegram_user.user,
      coin: signals_telegram_subscription.coin,
    )
    @service.call
  end

  protected

  def signals_telegram_subscription
    @signals_telegram_subscription ||= signals_telegram_user.signals_telegram_subscriptions
      .joins(:coin)
      .find_by(coins: { symbol: self.coin_symbol.upcase })
  end
end
