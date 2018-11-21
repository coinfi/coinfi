require 'sidekiq-scheduler'
class StakedCofiPerformActions
  include Sidekiq::Worker

  # Perform any checks or actions associated with staked COFI
  def perform
    associate_transactions_service = AssociateUnassignedStakedCofiTransactionsService.call
    puts "Associated #{associate_transactions_service.staked_cofi_transactions_updated.length} unassigned staked COFI transactions"

    send_emails_service = SendSignalsStakingConfirmationEmailsService.call(use_job_queue: false)
    puts "Sent signals staking confirmation email to #{send_emails_service.users_sent.length} users"
  end
end