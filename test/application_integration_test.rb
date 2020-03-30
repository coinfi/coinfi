require "test_helper"

class ApplicationIntegrationTest < ActionDispatch::IntegrationTest
  setup do
    ReactOnRails::TestHelper.ensure_assets_compiled

    postgres_url = ENV.fetch('COINFI_POSTGREST_URL')

    stub_request(:get, Regexp.new("#{postgres_url}/daily_ohcl_prices")).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'daily_ohcl_prices.json')))

    stub_request(:get, Regexp.new("#{postgres_url}/cmc_daily_ohcl_prices")).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'cmc_daily_ohcl_prices.json')))

    stub_request(:get, Regexp.new("#{postgres_url}/hourly_ohcl_prices")).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'hourly_ohcl_prices.json')))
  end

  protected
end
