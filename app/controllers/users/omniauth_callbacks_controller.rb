class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  include Devise::Controllers::Rememberable

  def twitter
    callback_from :twitter
  end

  def google_oauth2
    callback_from :google
  end

  def facebook
    # Used to re-request if email permission is not given
    # However, there is no way to differentiate between denied email permission and simply declining to authorize the app.
    # So we limit the re-requests before fully failing.
    if request.env["omniauth.auth"].info.email.blank?
      retries = get_facebook_retries
      if retries >= 2
        set_facebook_retries(0)
        redirect_to new_user_registration_path, alert: 'Facebook login failed. Make sure you have provided email permission.'
      else
        set_facebook_retries(retries + 1)
        redirect_to "#{user_facebook_omniauth_authorize_path}?auth_type=rerequest&scope=email"
      end
      return
    end

    callback_from :facebook
  end

  def failure
    redirect_to root_path
  end

  private

  def get_facebook_retries
    session["devise.facebook_data.retries"] || 0
  end

  def set_facebook_retries(number)
    session["devise.facebook_data.retries"] = number
  end

  def callback_from(provider)
    provider = provider.to_s

    @user = User.from_omniauth(request.env['omniauth.auth'])

    if @user.persisted?
      remember_me(@user)
      sign_in_and_redirect @user, event: :authentication #this will throw if @user is not activated
      set_flash_message(:notice, :success, :kind => provider.capitalize) if is_navigational_format?
    else
      session["devise.#{provider}_data"] = request.env["omniauth.auth"].except("extra")
      redirect_to after_sign_in_path_for(@user) + '#sign-up', alert: @user.errors.full_messages.join("\n")
    end
  end
end

