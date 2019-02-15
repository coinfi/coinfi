class TradingSignal < ApplicationRecord
  # Set the association trading_signal_trigger association as optional because we want to capture
  # all results and not enforce validations even if records were created out of order
  belongs_to :trading_signal_trigger, optional: true

  validates :external_id, uniqueness: true
  validates :trading_signal_trigger_id, presence: { unless: :trading_signal_trigger_external_id? }
  validates :trading_signal_trigger_external_id, presence: { unless: :trading_signal_trigger_id? }

  ETH_DECIMALS = 18
  AVAILABILITY_DELAY = 2.hours

  scope :available, -> { where('timestamp < ?', AVAILABILITY_DELAY.ago).where('created_at < ?', AVAILABILITY_DELAY.ago) }
  scope :large_transactions_signal, -> { where(trading_signal_trigger_external_id: '100002') }
  scope :abnormal_transactions_signal, -> { where(trading_signal_trigger_external_id: '100001') }
  scope :order_by_latest, -> { order(timestamp: :desc) }

  # This should only every be used for ETH, but keeping it generalized
  def self.get_large_transactions_by_period(coin: Coin.find_by_coin_key('ethereum.org'), period: :daily)
    if coin.blank? then return nil end
    if period == :daily
      @time_format = "%Y-%m-%d"
      @expires_in = 1.day.since.beginning_of_day - Time.now
    elsif period == :hourly
      @time_format = "%Y-%m-%d-%H"
      @expires_in = 1.hour.since.beginning_of_hour - Time.now
    else
      return nil
    end

    Rails.cache.fetch("daily_signals:#{coin.slug}:#{period}", expires_in: @expires_in) do
      # WHERE clauses should be equivalent to :available & :large_transactions_signal scopes
      signals = self.find_by_sql("
        SELECT * FROM
        (SELECT MIN(id) AS id, count(*) AS total_signals FROM trading_signals
          WHERE trading_signal_trigger_external_id = '100002'
          AND timestamp < '#{AVAILABILITY_DELAY.ago}'
          AND created_at < '#{AVAILABILITY_DELAY.ago}'
          GROUP BY CAST(timestamp AS date)
          ORDER BY CAST(timestamp AS date)
        ) AS s1
        JOIN trading_signals AS s2 ON s1.id = s2.id
        ORDER BY s2.timestamp;
      ")
      daily_signals = signals.map do |todays_signal|
        timestamp = todays_signal.timestamp

        # generate representative signal for display
        total_signals = todays_signal.total_signals

        price_data = todays_signal.price_data_by_coin(coin)
        to_address_name = todays_signal.extra.dig('transactions', 0, 'to_address_name')
        from_address_name = todays_signal.extra.dig('transactions', 0, 'from_address_name')

        price_data.merge({
          timestamp: timestamp,
          total_signals: total_signals,
          to_address_name: to_address_name,
          from_address_name: from_address_name,
          signal_type_id: 100002,
          signal_type_name: 'Whale Transfer'
        })
      end
    end
  end

  def self.get_recent_large_transactions(coin: Coin.find_by_coin_key('ethereum.org'), limit: 10)
    if coin.blank? then return nil end

    Rails.cache.fetch("recent_signals:#{coin.slug}:#{limit}", expires_in: 1.hour) do
      signals = self.available.large_transactions_signal.order_by_latest.limit(limit)

      recent_signals = signals.map do |s|
        price_data = s.price_data_by_coin(coin)
        to_address_name = s.extra.dig('transactions', 0, 'to_address_name')
        from_address_name = s.extra.dig('transactions', 0, 'from_address_name')
        transaction_hash = s.extra.dig('transactions', 0, 'hash')

        price_data.merge({
          timestamp: s.timestamp,
          to_address_name: to_address_name,
          from_address_name: from_address_name,
          transaction_hash: transaction_hash,
        })
      end
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
