class TradingSignals::DailyTokenExchangeTransactions
  def self.build
    included_trading_signals = TradingSignals::RecentTokenExchangeTransactionsQuery.call(time_window: 24.hours)
    included_token_transfers = included_trading_signals.map do |ts|
      ts.extra["token_transfer"]
    end

    trading_signal = TradingSignal.new(
      external_id: "0x#{SecureRandom.hex(20)}",
      trading_signal_trigger: TradingSignalTrigger.new(
        external_id: "daily-token-exchange-transactions",
        type_key: "daily-token-exchange-transactions",
        params: nil,
      ),
      extra: {
        token_transfers: included_token_transfers,
      },
      timestamp: DateTime.now,
    )
  end
end
