class SendSignalsStakingConfirmationEmailsService < Patterns::Service
  attr_reader :users_sent

  def initialize(user_scope: User.all, use_job_queue: true)
    @user_scope = user_scope
    @use_job_queue = use_job_queue
  end

  def call
    @users_sent = []

    users_awaiting_email.find_each do |user|
      if user.staked_cofi_amount < ENV.fetch('SIGNALS_MIN_STAKING_AMOUNT').to_d
        next
      end

      user.token_sale['reservation_confirmed_at'] = DateTime.now
      mail = SignalsMailer.staking_confirmation(user)
      if @use_job_queue
        mail.deliver_later
      else
        mail.deliver_now
      end
      user.save!

      @users_sent << user
    end

    true
  end

  def users_awaiting_email
    @users_awaiting_email ||= @user_scope
      .where("(token_sale->>'reservation_completed_at') IS NOT NULL")
      .where("(token_sale->>'reservation_confirmed_at') IS NULL")
  end
end
