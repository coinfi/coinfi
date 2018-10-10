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
end
