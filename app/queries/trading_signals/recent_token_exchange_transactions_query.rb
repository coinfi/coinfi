module TradingSignals
  class RecentTokenExchangeTransactionsQuery
    DEFAULT_TIME_WINDOW = 24.hours

    def self.call(
      relation = TradingSignal.all,
      time_window: DEFAULT_TIME_WINDOW
    )
      # Until `trading_signal_triggers` table is populated, we will need to use a workaround to find
      # these `token-exchange-transactions` signals via its contents
      relation
        .where("timestamp >= ?", DateTime.now - time_window)
        .where("(extra->>'token_transfer') IS NOT NULL")
    end
  end
end
