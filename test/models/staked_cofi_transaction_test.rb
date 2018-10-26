require 'test_helper'

class StakedCofiTransactionTest < ActiveSupport::TestCase
  test 'transaction_quantity is correct' do
    transaction = build(
      :staked_cofi_transaction,
      txn_value: '20000000000000000000000',
      txn_token_decimal: 18
    )
    assert_equal transaction.txn_quantity, 20000
  end
end
