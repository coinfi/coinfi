require "test_helper"

class ApplicationIntegrationTest < ActionDispatch::IntegrationTest
  setup do
    ReactOnRails::TestHelper.ensure_assets_compiled

    stub_request(:get, Regexp.new('api.coinmarketcap.com/v1/ticker')).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'coinmarketcap-ticker.json')))

    stub_request(:get, Regexp.new('coinmarketcap.northpole.ro/ticker.json')).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'northpole-ticker.json')))

    stub_request(:get, Regexp.new('postgrest.coinfi.com')).
      to_return(status: 200)
  end
end
