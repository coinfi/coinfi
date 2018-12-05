class DailyTokenExchangeTransactionsTradingSignalWorker
  include Sidekiq::Worker

  def perform
    trading_signal = TradingSignals::DailyTokenExchangeTransactions.build
    PublishTradingSignalWorker.new.perform trading_signal
  end
end
