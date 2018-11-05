class SignalsTelegramBot::WatchCoinForm < Patterns::Form
  attr_reader :service

  param_key 'watch_coin_form'

  attribute :signals_telegram_user
  attribute :coin_symbol

  validates :signals_telegram_user, presence: true
  validates :coin_symbol, presence: true
  validates :coin, presence: true, :if => proc { |f| f.coin_symbol.present? }

  def persist
    @service = WatchCoinService.new(
      user: signals_telegram_user.user,
      coin: coin,
    )
    @service.call
  end

  protected

  def coin
    @coin ||= Coin.order(ranking: :desc).find_by(symbol: coin_symbol.upcase)
  end
end
