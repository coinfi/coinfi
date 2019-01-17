module IndicatorsHelper
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