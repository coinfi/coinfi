require 'sidekiq-scheduler'
class StakedCofiRefreshTransactions
  include Sidekiq::Worker

  # Refresh staked cofi transactions by querying etherscan
  def perform
    # Since `is_txn_confirmations_gte_10` is the only field that may change, we can limit our query
    # to use that as a starting block
    earliest_unconfirmed_block_number = StakedCofiTransaction
      .where(is_txn_confirmations_gte_10: false)
      .order(txn_block_number: :asc)
      .select(:txn_block_number)
      .first
      &.txn_block_number
    latest_block_number = StakedCofiTransaction
      .order(txn_block_number: :desc)
      .select(:txn_block_number)
      .first
      &.txn_block_number
    start_block = earliest_unconfirmed_block_number || latest_block_number || 0

    transaction_items = fetch_token_transactions(start_block: start_block)
    puts "Found #{transaction_items.length} transactions"

    ActiveRecord::Base.transaction do
      transaction_items.each do |transaction_item|
        transaction = StakedCofiTransaction.find_by(txn_hash: transaction_item['hash'])
        # Check if we even need to update at all
        if transaction && transaction.is_txn_confirmations_gte_10
          puts "Already saved transaction #{transaction_item['hash']}"
          next
        end

        transaction ||= StakedCofiTransaction.new(
          txn_block_number: transaction_item['blockNumber'],
          txn_timestamp: DateTime.strptime(transaction_item['timeStamp'], '%s'),
          txn_hash: transaction_item['hash'],
          txn_block_hash: transaction_item['blockHash'],
          txn_from: transaction_item['from'],
          txn_to: transaction_item['to'],
          txn_value: transaction_item['value'],
          txn_token_decimal: transaction_item['tokenDecimal'].to_i,
        )
        transaction.is_txn_confirmations_gte_10 = (transaction_item['confirmations'].to_i >= 10)

        if transaction.changed?
          transaction.save!
          puts "Created/Updated transaction #{transaction_item['hash']}"
        end
      end
    end

    associate_transactions_service = AssociateUnassignedStakedCofiTransactionsService.call
    puts "Associated #{associate_transactions_service.staked_cofi_transactions_updated.length} unassigned staked COFI transactions"
  end

  def fetch_token_transactions(start_block: 0)
    offset = 1000
    page = 1
    result = []

    # Go through every available page and combine the results
    while page_result = fetch_page_token_transactions(start_block: start_block, offset: offset, page: page) do
      result = result.concat(page_result)
      page += 1

      # Skip checking next page if the current page size is less than what a page should normally
      # return
      if page_result.length < offset
        break
      end
    end
    result
  end

  def fetch_page_token_transactions(start_block:, page:, offset:)
    wallet_address = ENV.fetch('COINFI_COFI_STAKING_WALLET_ADDRESS')
    end_block = 99999999

    puts "Fetching transactions from block #{start_block} to #{end_block} page #{page}..."
    etherscan = Etherscan::Accounts.new
    page_items = etherscan.token_transactions(nil, wallet_address, {
      sort: 'asc',
      start_block: start_block,
      end_block: 99999999,
      offset: offset,
      page: page,
    })
  end
end