class ApplicationController < ActionController::Base
  include Responses
  protect_from_forgery with: :exception
  before_action :set_locale

  def after_sign_in_path_for(resource)
    return '/coins' if !has_news_feature?

    '/news'
  end

private

  def set_locale
    I18n.locale = params[:locale] || I18n.default_locale
  end

  def default_url_options
    return {} if I18n.locale == I18n.default_locale
    { locale: I18n.locale }
  end

protected

  def has_news_feature?
    current_user && $launch_darkly.variation('news', current_user.launch_darkly_hash, false)
  end
  helper_method :has_news_feature?

  def has_calendar_feature?
    current_user && $launch_darkly.variation('calendar', current_user.launch_darkly_hash, false)
  end
  helper_method :has_calendar_feature?

  def has_listings_feature?
    true
    # current_user && $launch_darkly.variation('listings', current_user.launch_darkly_hash, false)
  end
  helper_method :has_listings_feature?
end
