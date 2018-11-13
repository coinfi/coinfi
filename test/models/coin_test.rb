require 'test_helper'

class CoinTest < ActiveSupport::TestCase
  def setup
    @coin = Coin.create(name: 'CoinName')
  end

  test 'updates previous_name to name if name changes' do
    @coin.update_attribute :name, 'NewCoinName'
    assert_equal 'CoinName', @coin.previous_name
  end

  test "does not change previous_name if name doesn't change" do
    @coin.update_attribute :symbol, 'CN'
    assert_nil @coin.previous_name
  end

  test "listed live_market_data thru CoinMarketCap" do
    @coin.ico_status = 'listed'

    stub_request(:get, Regexp.new('api.coinmarketcap.com/v1/ticker')).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'coinmarketcap-ticker.json')))

    assert_includes @coin.live_market_data, "price_usd"
    assert_includes @coin.live_market_data, "24h_volume_usd"
    assert_includes @coin.live_market_data, "market_cap_usd"
  end

  test "listed live_market_data thru NorthPole proxy" do
    @coin.ico_status = 'listed'

    stub_request(:get, Regexp.new('api.coinmarketcap.com/v1/ticker')).to_return(status: 429)
    stub_request(:get, Regexp.new('coinmarketcap.northpole.ro/ticker.json')).
      to_return(status: 200, body: File.new(Rails.root.join('test', 'fixtures', 'northpole-ticker.json')))

    assert_includes @coin.live_market_data, "price_usd"
    assert_includes @coin.live_market_data, "24h_volume_usd"
    assert_includes @coin.live_market_data, "market_cap_usd"
  end
end
