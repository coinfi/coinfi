require "test_helper"

class ApplicationIntegrationTest < ActionDispatch::IntegrationTest
  setup do
    ReactOnRails::TestHelper.ensure_assets_compiled

    stub_request(:get, Regexp.new('api.coinmarketcap.com/v1/ticker')).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'coinmarketcap_ticker.json')))

    stub_request(:get, Regexp.new('coinmarketcap.northpole.ro/ticker.json')).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'northpole_ticker.json')))

    stub_request(:get, Regexp.new('postgrest.coinfi.com:3001/daily_ohcl_prices')).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'daily_ohcl_prices.json')))

    stub_request(:get, Regexp.new('postgrest.coinfi.com:3001/hourly_ohcl_prices')).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'hourly_ohcl_prices.json')))
  end
end
