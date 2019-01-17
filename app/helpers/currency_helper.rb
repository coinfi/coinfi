module CurrencyHelper
  def exchange_rates
    Rails.cache.read('exchange_rates')
  end

  def set_exchange_rates
    @exchange_rates = exchange_rates
  end
end