class SignalsController < ApplicationController
  def index
  end

  def reservation
  end

  def reservation_update
    params = reservation_update_params
    user = find_or_create_user(email: params[:email])

    user.token_sale ||= {}

    # Starting time.
    user.token_sale["signals_reservation_start_time"] = Time.now unless user.token_sale["signals_signup"]

    user.token_sale["signals_signup"] = true
    user.token_sale["telegram_username"] = params[:telegramUsername] if params["telegramUsername"].present?
    user.token_sale["staked_ethereum_address"] = params[:ethereumAddress] if params["ethereumAddress"].present?

    if params[:ethereumAddress].present? # This is the last step.
      user.token_sale["reservation_completed_at"] = Time.now
    end

    if user.save
      puts "Saved staking information for #{user.email}"

      # Send email with instructions if process is complete.
      if params[:ethereumAddress].present?
        SignalsMailer.staking_instructions(user).deliver_later
        puts "Sent staking instructions to #{user.email}"
      end

      head :created
    else
      head :unprocessable_entity
    end
  end

  private

  def find_or_create_user(email:)
    if user = User.find_for_authentication(email: email)
      return user
    end

    generated_password = Devise.friendly_token.first(12)
    user = User.create!(email: email, password: generated_password)
    SignalsMailer.password_notification(user, generated_password).deliver_later

    user
  end

  def reservation_update_params
    params.require(:signal).permit(:email, :telegramUsername, :ethereumAddress, :finalize)
  end
end
