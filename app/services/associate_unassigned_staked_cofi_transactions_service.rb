class AssociateUnassignedStakedCofiTransactionsService < Patterns::Service
  attr_reader :staked_cofi_transactions_updated

  def initialize(user_scope: User.all, staked_cofi_transactions_scope: StakedCofiTransaction.all)
    @user_scope = user_scope
    @staked_cofi_transactions_scope = staked_cofi_transactions_scope
  end

  def call
    @staked_cofi_transactions_updated = []

    ActiveRecord::Base.transaction do
      unassigned_staked_cofi_transactions.find_each do |transaction|
        transaction.set_user_by_txn_from(user_scope: @user_scope)
        unless transaction.changed?
          next
        end

        transaction.save!
        send_heap_event(transaction)
        @staked_cofi_transactions_updated << transaction
      end
    end

    true
  end

  def unassigned_staked_cofi_transactions
    @unassigned_staked_cofi_transactions ||= @staked_cofi_transactions_scope.where(user: nil)
  end

  private

  def send_heap_event(transaction)
    if transaction.user.blank?
      return
    end

    body = {
      'app_id' => ENV.fetch('HEAP_APP_ID'),
      'identity' => transaction.user.email,
      'properties' => {
        'hasStaked' => true,
      },
    }

    options = {
      body: body
    }

    HTTParty.post('https://heapanalytics.com/api/add_user_properties', options)
  end
end
