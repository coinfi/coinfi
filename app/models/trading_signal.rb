class TradingSignal < ApplicationRecord
  # Set the association trading_signal_trigger association as optional because we want to capture
  # all results and not enforce validations even if records were created out of order
  belongs_to :trading_signal_trigger, optional: true

  validates :external_id, uniqueness: true
  validates :trading_signal_trigger_id, presence: { unless: :trading_signal_trigger_external_id? }
  validates :trading_signal_trigger_external_id, presence: { unless: :trading_signal_trigger_id? }

  ETH_DECIMALS = 18

  scope :large_transactions_signal, -> { where(trading_signal_trigger_external_id: '100002') }
  scope :abnormal_transactions_signal, -> { where(trading_signal_trigger_external_id: '100001') }
  scope :order_by_latest, -> { order(timestamp: :desc) }

  # This should only every be used for ETH, but keeping it generalized
  def self.get_large_transactions_by_period(coin: Coin.find_by_coin_key('ethereum.org'), period: :daily)
    if coin.blank? then return nil end
    if period == :daily
      @time_format = "%Y-%m-%d"
    elsif period == :hourly
      @time_format = "%Y-%m-%d-%H"
    else
      return nil
    end

    signals = self.large_transactions_signal.order(timestamp: :asc)

    daily_signals = signals.group_by { |s| (s.timestamp || s.created_at).strftime(@time_format) }
      .sort
      .map do |date, todays_signals|
        timestamp = DateTime.strptime(date, @time_format)

        # generate representative signal for display
        first_signal = todays_signals[0]
        total_signals = todays_signals.length

        price_data = first_signal.price_data_by_coin(coin)
        price_data.merge({
          timestamp: timestamp,
          total_signals: total_signals,
        })
      end
  end

  def self.get_recent_large_transactions(coin: Coin.find_by_coin_key('ethereum.org'), limit: 10, delay: 2.hours)
    if coin.blank? then return nil end

    signals = self.large_transactions_signal
      .where('timestamp < ?', delay.ago)
      .where('created_at < ?', delay.ago)
      .order_by_latest.limit(limit)

    processed_signals = signals.map do |s|
      price_data = s.price_data_by_coin(coin)
      to_address_name = s.extra.dig('transactions', 0, 'to_address_name')
      from_address_name = s.extra.dig('transactions', 0, 'from_address_name')

      price_data.merge({
        timestamp: s.timestamp,
        to_address_name: to_address_name,
        from_address_name: from_address_name,
      })
    end
  end

  def as_dto
    {
      timestamp: self.timestamp.utc.iso8601,
      extra: self.extra,
      schema_version: "2018-11-08-00-00-00",
      external_id: self.external_id,
      trading_signal_trigger: self.trading_signal_trigger.as_dto
    }.as_json
  end

  # This currently only handles ETH transactions.
  # TODO: Generalize to handle token transactions, etc.?
  def raw_value
    if @raw_value.present? then return @raw_value end

    transactions = extra.dig('transactions')

    if transactions.blank? then return @raw_value = 0 end

    @raw_value = transactions.inject(0) { |sum, tx| sum + (tx.dig('value') || 0)  }
  end

  def price_data_by_coin(coin)
    if coin.blank? then return nil end

    # ETH is 10^18, all other token signals should have data
    decimal_places = coin.token_decimals || ETH_DECIMALS
    usd_value = coin.price

    value = BigDecimal(raw_value) / BigDecimal(10).power(decimal_places)
    price = value * usd_value

    {
      raw_value: raw_value,
      value: value,
      price: price,
    }
  end
end
