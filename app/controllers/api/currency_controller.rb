class Api::CurrencyController < ApiController

  def index
    rates = Rails.cache.read('exchange_rates')
    respond_success rates
  end
end