class ApplicationController < ActionController::Base

  protect_from_forgery with: :exception
  before_action :set_locale

  def after_sign_in_path_for(resource)
    '/dashboard'
  end

  def render_404
    raise ActionController::RoutingError.new('Not Found')
  end

  def render_403
    head :forbidden
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
