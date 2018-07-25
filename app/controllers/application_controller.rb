class ApplicationController < ActionController::Base
  include Responses
  protect_from_forgery with: :exception
  before_action :set_locale

  protected

  def after_sign_in_path_for(resource)
    sign_in_url = new_user_session_url
    if request.referer == sign_in_url
      super
    else
      stored_location_for(resource) || request.referer || news_path
    end
  end

  def after_sign_out_path_for(resource)
    request.referrer
  end

  def has_news_feature?
    true
    #current_user && $launch_darkly.variation('news', get_ld_user, false)
  end
  helper_method :has_news_feature?

  def get_ld_user
    {
      key: current_user.id,
      email: current_user.email,
      anonymous: false,
    }
  end

  private

  def set_locale
    I18n.locale = params[:locale] || I18n.default_locale
  end

  def default_url_options
    return {} if I18n.locale == I18n.default_locale
    { locale: I18n.locale }
  end
end
