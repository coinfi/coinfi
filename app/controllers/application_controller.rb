class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :set_locale

  layout :layout_by_resource

  def after_sign_in_path_for(resource)
    dashboard_path
  end

  private

  def layout_by_resource
    if devise_controller?
      "gsdk"
    else
      "application"
    end
  end

  def set_locale
    I18n.locale = params[:locale] || I18n.default_locale
  end

  def default_url_options
    { locale: I18n.locale }
  end
end
