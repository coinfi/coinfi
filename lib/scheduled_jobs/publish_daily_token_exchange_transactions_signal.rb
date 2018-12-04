require 'sidekiq-scheduler'

class PublishDailyTokenExchangeTransactionsSignal
  include Sidekiq::Worker

  def perform
    included_trading_signals = TradingSignals::RecentTokenExchangeTransactionsQuery.call(time_window: 24.hours)
    included_token_transfers = included_trading_signals.map do |ts|
      ts.extra["token_transfer"]
    end

    trading_signal = TradingSignal.new(
      external_id: "0x#{SecureRandom.hex(20)}",
      trading_signal_trigger_external_id: "daily-token-exchange-transactions",
      extra: {
        token_transfers: included_token_transfers,
      },
      timestamp: DateTime.now
    )
    PublishTradingSignalJob.perform_now(trading_signal)
  end
end
