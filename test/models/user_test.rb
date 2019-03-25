require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test 'staked_cofi_amount returns the correct amount' do
    user = create(:user)
    user.staked_cofi_transactions = create_list(:staked_cofi_transaction, 3,
      txn_value: '4000000000000000000000',
      txn_token_decimal: 18,
      is_txn_confirmations_gte_10: true
    )
    user.staked_cofi_transactions << create(:staked_cofi_transaction,
      txn_value: '4000000000000000000000',
      txn_token_decimal: 18,
      is_txn_confirmations_gte_10: false
    )
    assert_equal 12000, user.staked_cofi_amount

    user.token_sale =  { 'staked_cofi_amount': 10000 }
    assert_equal 10000, user.staked_cofi_amount
  end

  test 'verified user is confirmed' do
    user = create(:user)
    assert user.confirmed?
  end

  test 'unverified user is not confirmed' do
    user = create(:user, :unverified)
    refute user.confirmed?
  end
end
