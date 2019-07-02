class CalculateIndicatorsAndSignals < Patterns::Service
  def initialize(coin, limit = 200)
    @coin = coin
    @limit = limit
  end

  def call
    daily_price_data = parse_daily_prices(@coin)
    raw_indicators, signals = get_indicator_values_and_signals(daily_price_data)
    indicators = get_indicator_results(raw_indicators, signals)
    summary = get_summary(indicators)
    summary_value = get_summary_value(summary)

    {
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

  def get_summary_value(summary_signals, strong_threshold: 0.5, weak_threshold: 0.1, neutral_weight: 0.5)
    total = summary_signals.inject(0.0) do |sum, (k, v)|
      if k == :neutral
        sum + v * neutral_weight
      else
        sum + v
      end
    end
    raw_value = summary_signals[:sell] * -1 + summary_signals[:buy] * 1
    percent_value = raw_value / total

    if percent_value <= -1 * strong_threshold
      10 # strong sell
    elsif percent_value > -1 * strong_threshold && percent_value < -1 * weak_threshold
      30 # sell
    elsif percent_value > weak_threshold && percent_value < strong_threshold
      70 # buy
    elsif percent_value >= strong_threshold
      90 # strong buy
    else
      50 # neutral
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
