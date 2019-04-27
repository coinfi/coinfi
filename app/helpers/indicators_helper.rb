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
    'tron.network'
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

  def github_url(repo)
    "https://github.com/#{repo}"
  end
end