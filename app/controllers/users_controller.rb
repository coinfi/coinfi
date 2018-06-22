require 'open-uri'

class UsersController < DeviseController
  before_action :check_user_signed_in, except: [:signup]

  def signup
    @email = params[:email] || user_params[:email]
    ck = Convertkit::Client.new
    ck.add_subscriber_to_form('267531', @email) # 267531 is the Form ID for CoinFi ICO signup
    user = User.find_by_email @email
    if user
      if user.encrypted_password == ''
        sign_in(:user, user)
        redirect_to '/set-password' and return
      elsif user == current_user
        redirect_to '/news', alert: 'You are already logged in!' and return
      else
        redirect_to '/login', alert: 'Email already exists - please log in.' and return
      end
    end

    user = User.new(email: @email, skip_password_validation: true)
    user.token_sale = {} if user.token_sale.blank?
    user.token_sale['referred_by'] = request.env['affiliate.tag'] if request.env['affiliate.tag']
    user.token_sale["waitlist"] = true

    if user.save
      sign_in(:user, user)
      redirect_to '/set-password' and return
    elsif user.encrypted_password.blank?
      redirect_to '/set-password' and return
    end
    redirect_to '/register', alert: 'There was an issue with your signup - please try again!'
  end

  def set_password
  end

  def submit_password
    @password = user_params[:password]
    current_user.password = @password
    current_user.password_confirmation = @password
    if current_user.save
      sign_in(:user, current_user, bypass: true)
      redirect_to "/join-telegram"
    else
      redirect_to "/set-password", alert: "There was a problem saving your password: #{current_user.errors.full_messages.join('\n')} - please try again."
    end
  end

  def join_telegram
  end

protected

  def check_user_signed_in
    redirect_to new_user_session_path, alert: 'Please sign in or register.' and return unless current_user
  end

  def user_params
    params.require(:user).permit(:email, :password, :estimated_contribution)
  end

end
