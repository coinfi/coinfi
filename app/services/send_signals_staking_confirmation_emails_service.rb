class SendSignalsStakingConfirmationEmailsService < Patterns::Service
  attr_reader :users_sent

  def initialize(user_scope: User.all)
    @user_scope = user_scope
  end

  def call
    @users_sent = []

    users_awaiting_email.find_each do |user|
      if user.staked_cofi_amount < ENV.fetch('SIGNALS_MIN_STAKING_AMOUNT').to_d
        next
      end

      user.token_sale['signals_staking_confirmation_email_queued_at'] = DateTime.now
      SignalsMailer.staking_confirmation(user).deliver_later
      user.save!

      @users_sent << user
    end

    true
  end

  def users_awaiting_email
    @users_awaiting_email ||= @user_scope
      .where("(token_sale->>'reservation_completed_at') IS NOT NULL")
      .where("(token_sale->>'signals_staking_confirmation_email_queued_at') IS NULL")
  end
end
