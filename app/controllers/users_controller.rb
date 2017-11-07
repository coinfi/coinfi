class UsersController < DeviseController
  layout 'gsdk'

  def token_sale
    @token_sale_details = current_user.token_sale || {}
  end

  def signup
    @email = params[:email] || user_params[:email]
    ck = Convertkit::Client.new
    ck.add_subscriber_to_form('267531', @email) # 267531 is the Form ID for CoinFi ICO signup
    user = User.create(email: @email, skip_password_validation: true)
    if user
      sign_in(:user, user)
      redirect_to '/set-password'
    else
      # Show error message, have user sign up via /register page.
    end
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
    end
  end

  def join_telegram
  end

  def dashboard
  end

  def update
    return unless current_user
    current_user.token_sale = params[:user][:token_sale]
    current_user.save

    respond_to do |format|
      format.html { head :no_content }
      format.js
    end
  end

protected

  def user_params
    params.require(:user).permit(:email, :password, :estimated_contribution)
  end
end
