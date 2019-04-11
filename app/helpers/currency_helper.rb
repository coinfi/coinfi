module CurrencyHelper
  def exchange_rates
    Rails.cache.read('exchange_rates')
  end

  def set_exchange_rates
    @exchange_rates = exchange_rates
  end

  def has_currency?(currency)
    exchange_rates.key?(currency.upcase.to_sym)
  end
end