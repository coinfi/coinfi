module SignalsTelegramUsers
  class ForTradingSignalNotificationsQuery
    MIN_NOTIFICATION_INTERVALS_BY_TRADING_SIGNAL_TRIGGER_EXTERNAL_IDS = {
      'btc-longs-dominate': 1.day,
      'btc-longs-increase': 1.day,
      'btc-shorts-increase': 1.day,
    }

    def self.call(
      relation = SignalsTelegramUser.active,
      coin_key: nil,
      trading_signal_trigger_external_id: nil
    )
      result = relation

      # Apply `coin_key` filter
      if coin_key.present?
        result = result
          .joins(signals_telegram_subscriptions: :coin)
          .where(signals_telegram_subscriptions: { coins: { coin_key: coin_key }})
      end

      # Apply throttling to enforce min notification interval if defined for this
      # `trading_signal_trigger_external_id`
      if (
        trading_signal_trigger_external_id.present? &&
        (min_notification_interval = MIN_NOTIFICATION_INTERVALS_BY_TRADING_SIGNAL_TRIGGER_EXTERNAL_IDS.fetch(trading_signal_trigger_external_id.to_sym, 0)) > 0
      )
        signals_telegram_users_to_exclude = result
          .joins(trading_signal_notifications: :trading_signal)
          .where(trading_signal_notifications: { trading_signals: { trading_signal_trigger_external_id: trading_signal_trigger_external_id }})
          .group(:id)
          .having("MAX(trading_signals.timestamp) > ?", DateTime.now - min_notification_interval)

        result = result.where.not(id: signals_telegram_users_to_exclude)
      end

      result
    end
  end
end
