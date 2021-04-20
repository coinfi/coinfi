class CalculateIndicatorsAndSignals < Patterns::Service
  CONSENSUS_VALUES = {
    strong_sell: 10,
    sell: 30,
    neutral: 50,
    buy: 70,
    strong_buy: 90
  }

  def initialize(coin, limit = 200)
    @coin = coin
    @limit = limit
  end

  def call
    last_updated = Time.parse(@coin.prices_data.last['time']) + 1.day,
    daily_price_data = parse_daily_prices(@coin)
    raw_indicators, signals = get_indicator_values_and_signals(daily_price_data)
    indicators = get_indicator_results(raw_indicators, signals)
    summary = get_summary(indicators)
    summary_value = get_summary_value(summary)

    {
      last_updated: last_updated.to_s,
      raw_indicators: raw_indicators,
      signals: signals,
      indicators: indicators,
      summary: summary,
      summary_value: summary_value,
    }
  end

  private

  def parse_daily_prices(coin)
    coin.prices_data
      .map do |d|
        { adj_close: d['close'] || 0, high: d['high'] || 0, low: d['low'] || 0 }
      end
      .last(@limit) # limit dataset for easier processing
  end

  def get_rounding_places(value)
    abs_value = value.abs
    if abs_value >= 100
      0
    elsif abs_value >= 1
      1
    else
      6
    end
  end

  def get_indicator_values_and_signals(data)
    indicators = {
      rsi: rsi(data),
      stochrsi: stochastic_rsi(data),
      macd: macd(data),
      cci: cci(data),
      stochastic_fast: stochastic_fast(data),
      stochastic_slow: stochastic_slow(data),
      sma: (simple_moving_average(data, 20) - simple_moving_average(data, 50)),
      ema: (exponential_moving_average(data, 10) - exponential_moving_average(data, 20))
    }

    signals = get_indicator_signals(indicators)

    indicators.each do |k, v|
      rounding_places = get_rounding_places(v)
      indicators[k] = v.round(rounding_places)
    end

    return indicators, signals
  end

  def get_indicator_signals(indicator_values)
    {
      rsi: rsi_signal(indicator_values[:rsi]),
      stochrsi: stochrsi_signal(indicator_values[:stochrsi]),
      macd: macd_signal(indicator_values[:macd]),
      cci: cci_signal(indicator_values[:cci]),
      stochastic_fast: stochastic_fast_signal(indicator_values[:stochastic_fast]),
      stochastic_slow: stochastic_slow_signal(indicator_values[:stochastic_slow]),
      sma: simple_moving_average_signal(indicator_values[:sma]),
      ema: exponential_moving_average_signal(indicator_values[:ema])
    }
  end

  def get_indicator_results(indicators, signals)
    [
      {
        symbol: :rsi,
        value: indicators[:rsi],
        min: 0,
        max: 100,
        signal: signals[:rsi],
      },
      {
        symbol: :stochrsi,
        value: indicators[:stochrsi],
        min: 0,
        max: 100,
        signal: signals[:stochrsi],
      },
      {
        symbol: :macd,
        value: indicators[:macd],
        min: nil,
        max: nil,
        signal: signals[:macd],
      },
      {
        symbol: :cci,
        value: indicators[:cci],
        min: nil,
        max: nil,
        signal: signals[:cci],
      },
      {
        symbol: :stochastic_fast,
        value: indicators[:stochastic_fast],
        min: 0,
        max: 100,
        signal: signals[:stochastic_fast],
      },
      {
        symbol: :stochastic_slow,
        value: indicators[:stochastic_slow],
        min: 0,
        max: 100,
        signal: signals[:stochastic_slow],
      },
      {
        symbol: :sma,
        value: indicators[:sma],
        min: nil,
        max: nil,
        signal: signals[:sma],
      },
      {
        symbol: :ema,
        value: indicators[:ema],
        min: nil,
        max: nil,
        signal: signals[:ema],
      }
    ]
  end

  def get_summary(indicators)
    indicators.inject({buy: 0, neutral: 0, sell: 0}) do |sum, indicator|
      case indicator[:signal]
      when "BUY"
        sum.update(buy: sum[:buy] + 1)
      when "SELL"
        sum.update(sell: sum[:sell] + 1)
      when "NEUTRAL"
        sum.update(neutral: sum[:neutral] + 1)
      else
        sum
      end
    end
  end

  # Strong threshold: a strong buy/sell, obvious from visual inspection
  # Weak threshold: possible buy/sell, conditioned on a weak opposing signal
  # Opposing threshold: what is a "weak opposing signal" compared to the signal under consideration.
  #   We use is_weak_sell to provide an additional bias for signals that look especially weak (i.e., < 50%)
  # Neutral threshold: an overriding neutral condition; the basic logic is if not buy/sell, then neutral.
  #   But in some cases, it should be neutral even if a buy or sell condition could be met
  def get_summary_value(summary_signals, strong_threshold: 0.75, weak_threshold: 0.4, neutral_threshold: 0.5, opposing_threshold: 0.1)
    total_signals = summary_signals.inject(0) { |total, (k, v)| total + v }.to_f
    neutral_percentage = summary_signals[:neutral] / total_signals
    buy_percentage = summary_signals[:buy] / total_signals
    sell_percentage = summary_signals[:sell] / total_signals
    if weak_threshold + opposing_threshold > 1
      opposing_threshold = 1.0 - weak_threshold
    end

    if neutral_percentage >= neutral_threshold
      CONSENSUS_VALUES[:neutral]
    elsif (buy_percentage >= strong_threshold) || (buy_percentage >= weak_threshold && is_weak_pass(buy_percentage, sell_percentage, opposing_threshold))
    then
      if buy_percentage >= strong_threshold
        CONSENSUS_VALUES[:strong_buy]
      else
        CONSENSUS_VALUES[:buy]
      end
    elsif (sell_percentage >= strong_threshold) || (sell_percentage >= weak_threshold && is_weak_pass(sell_percentage, buy_percentage, opposing_threshold))
    then
      if sell_percentage >= strong_threshold
        CONSENSUS_VALUES[:strong_sell]
      else
        CONSENSUS_VALUES[:sell]
      end
    else
      CONSENSUS_VALUES[:neutral]
    end
  end

  def is_weak_pass(percentage, opposing_percentage, opposing_threshold, below_half_penalty = 0.1)
    if percentage >= 0.5
      percentage > opposing_percentage + opposing_threshold
    else
      percentage > opposing_percentage + opposing_threshold + below_half_penalty
    end
  end

  # RSI 14
  # https://www.investopedia.com/terms/r/rsi.asp
  # accuracy increases with data set size
  def rsi(data, period = 14)
    if data.length < period
      return nil
    end

    output = Indicators::Data.new(data)
      .calc(:type => :rsi, :params => period)
      .output
    output.last
  end

  def rsi_signal(value)
    if value < 30
      "BUY"
    elsif value > 70
      "SELL"
    else
      "NEUTRAL"
    end
  end

  # Stochastic RSI 14
  # https://www.investopedia.com/terms/s/stochrsi.asp
  def stochastic_rsi(data, period = 14)
    if data.length < period
      return nil
    end

    output = Indicators::Data.new(data)
    .calc(:type => :stochrsi, :params => period)
    .output

    # Actual value is from 0-1 but we display as 0-100
    output.last * 100
  end

  def stochrsi_signal(value)
    if value < 20
      "BUY"
    elsif value > 80
      "SELL"
    else
      "NEUTRAL"
    end
  end

  # MACD (12, 26, 9)
  # https://www.investopedia.com/terms/m/macd.asp
  def macd(data, fast = 12, slow = 26, signal = 9)
    if data.length < slow + signal
      return nil
    end

    output = Indicators::Data.new(data)
      .calc(:type => :macd, :params => [fast, slow, signal])
      .output

    # output is [MACD, Signal, MACD Hist]
    output.last[0]
  end

  def macd_signal(value)
    if value > 0
      "BUY"
    elsif value < 0
      "SELL"
    else
      ""
    end
  end

  # CCI
  # https://www.investopedia.com/terms/c/commoditychannelindex.asp
  # https://www.investopedia.com/ask/answers/012015/what-are-differences-between-relative-strength-index-rsi-commodity-channel-index-cci.asp
  # Needs high/low/close data as {high, low, adj_close}
  def cci(data, period = 20)
    if data.length < period
      return nil
    end

    output = Indicators::Data.new(data)
      .calc(:type => :cci, :params => period)
      .output
    output.last
  end

  def cci_signal(value)
    if value < -100
      "BUY"
    elsif value > 100
      "SELL"
    else
      "NEUTRAL"
    end
  end

  # https://www.investopedia.com/terms/s/stochasticoscillator.asp
  # https://stockcharts.com/articles/mailbag/2010/04/full-stochastics-and-qqqq.html
  # Stochastic Fast (14, 3)
  # %K
  # Stochastic Full (14, 3, 3)
  # 3-day sma %K (i.e., Full or Slow %K)
  # Needs high/low/close data as {high, low, adj_close}
  def stochastic(data, period = 14, k_smoothing = 3, d_smoothing = 3)
    if data.length < period
      return nil
    end

    output = Indicators::Data.new(data)
      .calc(:type => :sto, :params => [period, k_smoothing, d_smoothing])
      .output

    output.last
  end

  def stochastic_fast(data, period = 14, k_smoothing = 3)
    output = stochastic(data, period, k_smoothing)
    output[0]
  end

  def stochastic_fast_signal(value)
    if value < 20
      "BUY"
    elsif value > 80
      "SELL"
    else
      "NEUTRAL"
    end
  end

  def stochastic_slow(data, period = 14, k_smoothing = 3, d_smoothing = 3)
    output = stochastic(data, period, k_smoothing, d_smoothing)
    output[1]
  end

  def stochastic_slow_signal(value)
    if value < 20
      "BUY"
    elsif value > 80
      "SELL"
    else
      "NEUTRAL"
    end
  end

  # Simple Moving Average
  # https://www.investopedia.com/terms/s/sma.asp
  def simple_moving_average(data, period = 20)
    if data.length < period
      return nil
    end

    output = Indicators::Data.new(data)
      .calc(:type => :sma, :params => period)
      .output
    output.last
  end

  def simple_moving_average_signal(value)
    if value > 0
      "BUY"
    elsif value < 0
      "SELL"
    else
      ""
    end
  end

  # Exponential Moving Average
  # https://www.investopedia.com/terms/e/ema.asp
  def exponential_moving_average(data, period = 12)
    if data.length < period
      return nil
    end

    output = Indicators::Data.new(data)
      .calc(:type => :ema, :params => period)
      .output
    output.last
  end

  def exponential_moving_average_signal(value)
    if value > 0
      "BUY"
    elsif value < 0
      "SELL"
    else
      ""
    end
  end
end
