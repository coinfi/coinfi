namespace :staked_cofi do
  desc "Perform any checks or actions associated with staked COFI"
  task :perform_actions => :environment do
    associate_transactions_service = AssociateUnassignedStakedCofiTransactionsService.call
    puts "Associated #{associate_transactions_service.staked_cofi_transactions_updated.length} unassigned staked COFI transactions"

    send_emails_service = SendSignalsStakingConfirmationEmailsService.call
    puts "Sent signals staking confirmation email to #{send_emails_service.users_sent.length} users"
  end
end
