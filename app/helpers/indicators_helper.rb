module IndicatorsHelper
  INDICATOR_COIN_KEYS = [
    'bitcoin.org',
    'ethereum.org',
    'bitcoincash.org',
    'ripple.com',
    'dash.org',
    'litecoin.com',
    'ethereumclassic.org',
    'cardano.org',
    'iota.org',
    'stellar.org',
    'eos.io',
    'neo.org/neo',
    'z.cash',
    'binance.com',
    'tron.network',
    'tezos.com',
    'algorand.com',
    'basicattentiontoken.org',
    'chain.link',
    'decentraland.org',
    'dogecoin.com',
    'enjincoin.io',
    'makerdao.com/maker',
    'matic.network',
    'aave.com',
    'compound.finance',
    'shibatoken.com/shib',
    'uniswap.org',
    'yearn.finance'
  ]

  def get_buy_sell_class(value)
    if value > 0
      'buy'
    elsif value < 0
      'sell'
    else
      'neutral'
    end
  end

  def get_consensus_symbol(value)
    if value == 10    # strong sell
      :sell
    elsif value == 30 # sell
      :sell
    elsif value == 70 # buy
      :buy
    elsif value == 90 # strong buy
      :buy
    else              # neutral (50)
      :neutral
    end
  end

  def get_consensus_string(value)
    consensus = get_consensus_symbol(value)
    if consensus == :sell
      'sell'
    elsif consensus == :buy
      'buy'
    else
      'hold'
    end
  end

  def github_url(repo)
    "https://github.com/#{repo}"
  end

  def gitlab_url(repo)
    "https://gitlab.com/#{repo}"
  end

  def format_price(value, precision: 0)
    number_to_human(value,
      precision: precision,
      significant: false,
      units: :abbreviated_numbers,
      format: '%n%u',
      locale: :en
    )
  end

  def format_supply(value, precision: 0)
    number_with_delimiter(number_with_precision(value, precision: precision))
  end

  def format_percentage(value, precision: 2)
    number_to_percentage(value, precision: precision)
  end

  def symbol_to_ticker_name(symbol)
    case symbol&.upcase
    when 'SHIB'
      'SHIBxM'
    else
      symbol
    end
  end

  def ticker_name_to_symbol(name)
    case name&.upcase
    when 'SHIBXM'
      'SHIB'
    else
      name
    end
  end
end