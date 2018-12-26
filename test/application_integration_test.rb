require "test_helper"

class ApplicationIntegrationTest < ActionDispatch::IntegrationTest
  setup do
    ReactOnRails::TestHelper.ensure_assets_compiled

    postgres_url = ENV.fetch('COINFI_POSTGREST_URL')

    stub_request(:get, Regexp.new('api.coinmarketcap.com/v1/ticker')).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'coinmarketcap_ticker.json')))

    stub_request(:get, Regexp.new('coinmarketcap.northpole.ro/ticker.json')).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'northpole_ticker.json')))

    stub_request(:get, Regexp.new("#{postgres_url}/daily_ohcl_prices")).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'daily_ohcl_prices.json')))

    stub_request(:get, Regexp.new("#{postgres_url}/hourly_ohcl_prices")).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'hourly_ohcl_prices.json')))

    stub_request(:get, Regexp.new("#{postgres_url}/metrics_chart_view")).
      to_return(status: 200, body: '[]')

    stub_request(:get, Regexp.new("#{postgres_url}/exchange_supply_metrics_view")).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'exchange_supply_metrics_view.json')))

    stub_request(:get, Regexp.new("#{postgres_url}/token_retention_rate_metrics_view")).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'token_retention_rate_metrics_view.json')))

    stub_request(:get, Regexp.new("#{postgres_url}/unique_wallet_count_metrics_view")).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'unique_wallet_count_metrics_view.json')))

    stub_request(:get, Regexp.new("#{postgres_url}/token_distribution_100_metrics_view")).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'token_distribution_100_metrics_view.json')))

    stub_request(:get, Regexp.new("#{postgres_url}/token_velocity_metrics_view")).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'token_velocity_metrics_view.json')))
  end
end
