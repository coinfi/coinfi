class AssociateUnassignedStakedCofiTransactionsService < Patterns::Service
  def initialize(user_scope: User.all, staked_cofi_transactions_scope: StakedCofiTransaction.all)
    @user_scope = user_scope
    @staked_cofi_transactions_scope = staked_cofi_transactions_scope
  end

  def call
    ActiveRecord::Base.transaction do
      self.unassigned_staked_cofi_transactions.find_each do |transaction|
        transaction.set_user_by_txn_from(user_scope: @user_scope)
        if transaction.changed?
          transaction.save!
        end
      end
    end

    true
  end

  private

  def unassigned_staked_cofi_transactions
    @unassigned_staked_cofi_transactions ||= @staked_cofi_transactions_scope
      .where(user: nil)
  end
end
