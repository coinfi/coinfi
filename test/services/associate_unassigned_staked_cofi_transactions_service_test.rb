require 'test_helper'

class AssociateUnassignedStakedCofiTransactionsServiceTest < ActiveSupport::TestCase
  setup do
    stub_request(:post, "https://heapanalytics.com/api/add_user_properties").
      to_return(status: 200, body: "", headers: {})
  end

  test 'associates unassigned transactions to the correct user' do
    other_users = create_list(:user, 3, :with_completed_signals_reservation)
    user = create(:user, :with_completed_signals_reservation)
    staked_ethereum_address = user.token_sale.fetch('staked_ethereum_address')
    staked_cofi_transactions = create_list(:staked_cofi_transaction, 2, txn_from: staked_ethereum_address, user: nil)

    associate_transactions_service = AssociateUnassignedStakedCofiTransactionsService.call
    assert_equal staked_cofi_transactions, associate_transactions_service.staked_cofi_transactions_updated
    staked_cofi_transactions.each do |transaction|
      transaction.reload
      assert_equal user, transaction.user
    end
  end

  test 'ignores transactions without matching user' do
    other_users = create_list(:user, 3, :with_completed_signals_reservation)
    staked_cofi_transactions = create_list(:staked_cofi_transaction, 2)

    associate_transactions_service = AssociateUnassignedStakedCofiTransactionsService.call
    assert_equal [], associate_transactions_service.staked_cofi_transactions_updated
    staked_cofi_transactions.each do |transaction|
      transaction.reload
      assert_nil transaction.user
    end
  end

  test 'ignores transactions already associated with user' do
    user = create(:user, :with_completed_signals_reservation)
    staked_cofi_transactions = create_list(:staked_cofi_transaction, 2, user: user)

    associate_transactions_service = AssociateUnassignedStakedCofiTransactionsService.call
    assert_equal [], associate_transactions_service.staked_cofi_transactions_updated
    staked_cofi_transactions.each do |transaction|
      transaction.reload
      assert_equal user, transaction.user
    end
  end
end
