require 'open-uri'
BLOCKED_COUNTRIES = ENV.fetch('BLOCKED_COUNTRIES').to_s.split(',')

class UsersController < DeviseController
  layout 'gsdk'
  before_action :check_user_signed_in, except: [:signup]
  before_action :set_s3_direct_post, only: [:kyc, :submit_kyc]

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
      redirect_to "/estimate-contribution"
    else
      redirect_to "/set-password", notice: "There was a problem saving your password: #{current_user.errors.full_messages.join('\n')} - please try again."
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
    if current_user.in_referral_program?
      @referral_link = "https://sale.coinfi.com/?ref=#{current_user.id}"
      @referrals = current_user.get_referrals
    end
  end

  def kyc
    redirect_to dashboard_path if current_user.kyc_completed?
  end

  def submit_kyc
    # Server side param check
    required_params = %i[
      first_name last_name date_of_birth gender nationality residency ethereum_address id_doc_image selfie_image
      confirm_correct_info confirm_no_legal_restrictions confirm_privacy_policy confirm_token_agreement confirm_terms_conditions
    ]
    unless required_params.all? { |k| params[k].present? }
      return redirect_to kyc_path, notice: 'You must fill in all fields, including the check boxes!'
    end

    current_user.token_sale = {} if current_user.token_sale.blank?
    current_user.token_sale.merge!({
      "first_name" => params[:first_name],
      "last_name" => params[:last_name],
      "date_of_birth" => params[:date_of_birth],
      "gender" => params[:gender],
      "nationality" => params[:nationality],
      "residency" => params[:residency],
      "ethereum_address" => params[:ethereum_address],
      "id_doc_image" => params[:id_doc_image],
      "selfie_image" => params[:selfie_image],
      "confirm_correct_info" => params[:confirm_correct_info],
      "confirm_no_legal_restrictions" => params[:confirm_no_legal_restrictions],
      "confirm_privacy_policy" => params[:confirm_privacy_policy],
      "confirm_token_agreement" => params[:confirm_token_agreement],
      "confirm_terms_conditions" => params[:confirm_terms_conditions],
    })
    current_user.save

    if Artemis.restricted_residencies.include? params[:residency]
      redirect_to dashboard_path and return
    end

    # TODO: Run in background job?
    current_user.run_kyc!

    redirect_to dashboard_path
  end

protected

  def render_if_blocked_country
    render "blocked" if BLOCKED_COUNTRIES.include? request.env['HTTP_CF_IPCOUNTRY']
  end

  def check_user_signed_in
    redirect_to new_user_session_path, notice: 'Please sign in or register.' and return unless current_user
  end

  def user_params
    params.require(:user).permit(:email, :password, :estimated_contribution)
  end

private

  def set_s3_direct_post
    @s3_direct_post = S3_BUCKET.presigned_post(
      key: "#{current_user.id}/${filename}",
      success_action_status: '201',
    )
  end
end
