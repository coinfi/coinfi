require 'test_helper'

class StakedCofiTransactionTest < ActiveSupport::TestCase
  test 'txn_quantity is correct' do
    transaction = build(
      :staked_cofi_transaction,
      txn_value: '20000000000000000000000',
      txn_token_decimal: 18
    )
    assert_equal 20000, transaction.txn_quantity
  end

  test 'txn_quantity is correct when txn_value is small' do
    transaction = build(
      :staked_cofi_transaction,
      txn_value: '1',
      txn_token_decimal: 18
    )
    assert_equal 10 ** -18, transaction.txn_quantity
  end

  test 'txn_quantity is correct when txn_value is 0' do
    transaction = build(
      :staked_cofi_transaction,
      txn_value: '0',
      txn_token_decimal: 18
    )
    assert_equal 0, transaction.txn_quantity
  end

  test 'txn_quantity is correct when txn_token_decimal is 0' do
    transaction = build(
      :staked_cofi_transaction,
      txn_value: '20000',
      txn_token_decimal: 0
    )
    assert_equal 20000, transaction.txn_quantity
  end

  test 'txn_quantity is correct when txn_value is 0 and txn_token_decimal is 0' do
    transaction = build(
      :staked_cofi_transaction,
      txn_value: '0',
      txn_token_decimal: 0
    )
    assert_equal 0, transaction.txn_quantity
  end
end
