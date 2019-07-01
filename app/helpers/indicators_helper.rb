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

  def set_locale
    if I18n.available_locales.map(&:to_s).include?(params[:lang])
      I18n.locale = params[:lang]
    else
      I18n.default_locale
    end
  end
end