require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test 'staked_cofi_amount returns the correct amount' do
    user = create(:user)
    user.staked_cofi_transactions = create_list(:staked_cofi_transaction, 5,
      txn_value: '4000000000000000000000',
      txn_token_decimal: 18,
    )
    assert_equal 20000, user.staked_cofi_amount

    user.token_sale =  { 'staked_cofi_amount': 10000 }
    assert_equal 10000, user.staked_cofi_amount
  end
end
