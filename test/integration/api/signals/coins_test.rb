require 'application_integration_test'
require 'test_helper'
require 'uri'
require_relative './base_test'

class Api::Signals::CoinsTest < Api::Signals::BaseTest
  setup do
    @coins = create_list(:coin, 3)
  end

  test "show using `coin_key`" do
    coin = @coins.sample
    escaped_coin_key = URI::encode(coin.coin_key, /\W/)

    get "/api/signals/coins/#{escaped_coin_key}", headers: auth_headers
    assert_equal 200, status
    assert_equal(
      {
        "id" => coin.id,
        "name" => coin.name,
        "symbol" => coin.symbol,
        "slug" => coin.slug,
        "ranking" => coin.ranking,
        "coin_key" => coin.coin_key,
        "eth_address" => coin.eth_address,
        "price" => coin.price,
        "token_decimals" => coin.token_decimals,
        "is_signals_supported_erc20" => coin.is_signals_supported_erc20?,
      },
      response.parsed_body
    )
  end

  test "show returns 404 when using wrong `coin_key`" do
    dummy_coin_key = 'aaa'

    assert_raises(ActiveRecord::RecordNotFound) do
      get "/api/signals/coins/#{dummy_coin_key}", headers: auth_headers
    end
  end
end
