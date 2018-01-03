class ApplicationMailer < ActionMailer::Base
  default from: 'CoinFi <contact@coinfi.com>'
  layout 'mailer'

  def kyc_confirmation(user)
    @user = user
    mail(to: @user.email, subject: "Congrats, you are now eligible for the CoinFi Token Sale")
  end
end
