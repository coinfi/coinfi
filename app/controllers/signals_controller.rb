class SignalsController < ApplicationController
  def index
  end

  def reservation
    @random = rand(0..9999)
  end

  def reservation_update
    params = reservation_update_params
    @user = find_or_create_user(email: params[:email])

    @user.token_sale = @user.token_sale || {}
    @user.token_sale["telegram_handle"] = params[:telegram_username]
    @user.token_sale["staked_ethereum_address"] = params[:ethereum_address]

    if @user.save
      head :created
    else
      head :unprocessable_entity
    end
  end

  def reservation_complete
    params = reservation_update_params
    @user = find_or_create_user(email: params[:email])

    @user.token_sale = @user.token_sale || {}
    @user.token_sale["telegram_handle"] = params[:telegram_username]
    @user.token_sale["staked_ethereum_address"] = params[:ethereum_address]
    @user.token_sale["reservation_completed_at"] = Time.now

    if @user.save
      # Send email with instructions
      SignalsMailer.staking_instructions(user).deliver
      head :created
    else
      head :unprocessable_entity
    end
  end

  private

  def find_or_create_user(email:)
    if user = User.find_by(email: email)
      return user
    end

    generated_password = Devise.friendly_token.first(12)
    user = User.create!(email: email, password: generated_password)

    if user
      SignalsMailer.password_notification(user, generated_password).deliver
    end

    user
  end

  def reservation_update_params
    params
      .require(:reservation)
      .permit(:email, :telegram_username, :ethereum_address)
  end
end
