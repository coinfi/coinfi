class SignalsMailer < ApplicationMailer
  default from: 'CoinFi Trading Signals <signals@coinfi.com>'

  def password_notification(user, generated_password)
    @generated_password = generated_password
    mail(to: user.email, subject: "Password to your CoinFi account")
  end

  def staking_instructions(user)
    @staked_ethereum_address = user.token_sale["staked_ethereum_address"]
    raise WTF unless !@staked_ethereum_address
    # TODO: Remember to remove the "beta" tag once we're out of beta!
    mail(to: user.email, subject: "Finish reserving your spot for the CoinFi Trading Signals beta")
  end
end
