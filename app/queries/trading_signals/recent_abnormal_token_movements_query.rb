module TradingSignals
  class RecentAbnormalTokenMovementsQuery
    DEFAULT_TIME_WINDOW = 24.hours

    def self.call(
      relation = TradingSignal.all,
      time_window: DEFAULT_TIME_WINDOW
    )
      # Until `trading_signal_triggers` table, we will need to use a workaround to find these
      # `token-exchange-transactions` signals via its contents
      result = relation
        .where("timestamp >= ?", DateTime.now - time_window)
        .where("(extra->>'token_transfer') IS NOT NULL")

      result
    end
  end
end
