require 'httparty'
require 'sidekiq-scheduler'

class UpdateCurrencies
  include Sidekiq::Worker

  def perform
    currency_url = "https://api.exchangeratesapi.io/latest?base=USD"
    
    begin
      response = HTTParty.get(currency_url)
      contents = JSON.parse(response.body, :symbolize_names => true)

      exchange_rates = contents[:rates]
      exchange_rates[:updated_at] = contents[:date]
      Rails.cache.write('exchange_rates', exchange_rates)
    rescue => e
      puts e.message
    end
  end
end