class ApplicationController < ActionController::Base
  include Responses
  protect_from_forgery with: :exception
  before_action :set_hide_subheader, :set_locale
  before_action :set_paper_trail_whodunnit

  def after_sign_in_path_for(resource)
    '/watchlist'
  end

protected

  def set_hide_subheader
    @hide_subheader = true
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
