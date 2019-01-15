class Api::CurrencyController < ApiController
  include CurrencyHelper

  def index
    respond_success exchange_rates
  end
end