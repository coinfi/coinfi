class UsersController < DeviseController
  layout 'gsdk'
  before_action :check_user_signed_in, only: [
    :set_password, :submit_password, :estimate_contribution, :submit_contribution, :join_telegram, :dashboard, :update
  ]

  def signup
    @email = params[:email] || user_params[:email]
    ck = Convertkit::Client.new
    ck.add_subscriber_to_form('267531', @email) # 267531 is the Form ID for CoinFi ICO signup
    user = User.find_by_email @email
    if user
      if user == current_user
        redirect_to '/dashboard', notice: 'You are already logged in!' and return
      else
        redirect_to '/login', notice: 'Email already exists - please log in.' and return
      end
    end

    user = User.new(email: @email, skip_password_validation: true)
    user.token_sale = {} if user.token_sale.blank?
    user.token_sale['referred_by'] = request.env['affiliate.tag'] if request.env['affiliate.tag']
    if user.save
      sign_in(:user, user)
      redirect_to '/set-password' and return
    elsif user.encrypted_password.blank?
      redirect_to '/set-password' and return
    end
    redirect_to '/register', notice: 'There was an issue with your signup - please try again!'
  end

  def set_password
  end

  def submit_password
    @password = user_params[:password]
    current_user.password = @password
    current_user.password_confirmation = @password
    if current_user.save
      sign_in(:user, current_user, bypass: true)
      redirect_to '/estimate-contribution'
    else
      redirect_to '/set-password', notice: 'There was a problem saving your password: #{current_user.errors.full_messages} - please try again.'
    end
  end

  def estimate_contribution
  end

  def submit_contribution
    current_user.token_sale = {} if current_user.token_sale.blank?
    current_user.token_sale['estimated_contribution'] = user_params[:estimated_contribution]
    if current_user.save
      redirect_to '/join-telegram'
    else
      redirect_to '/estimate-contribution', notice: 'There was a problem saving your estimated contribution: #{current_user.errors.full_messages} - please try again.'
    end
  end

  def join_telegram
  end

  def dashboard
    if current_user.token_sale.fetch('referral_program', nil)
      @referral_link = "https://sale.coinfi.com/?ref=#{current_user.id}"
      @referrals = current_user.get_referrals
    end
  end

protected

  def check_user_signed_in
    redirect_to new_user_session_path, notice: 'Please sign in or register.' and return unless current_user
  end

  def user_params
    params.require(:user).permit(:email, :password, :estimated_contribution)
  end
end
