class ApplicationController < ActionController::Base
  include Responses
  MAX_ACCEPTABLE_REPLICATION_LAG = ApplicationHelper::MAX_ACCEPTABLE_REPLICATION_LAG

  protect_from_forgery with: :exception
  before_action :set_locale
  before_action :set_no_seo, if: :devise_controller?

  def after_sign_in_path_for(resource)
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

  def is_production?
    (ENV['IS_PRODUCTION'] || "false").downcase == 'true'
  end
  helper_method :is_production?

  def has_calendar_feature?
    false
  end
  helper_method :has_calendar_feature?

  def has_listings_feature?
    false
  end
  helper_method :has_listings_feature?

  def set_no_seo
    set_meta_tags(
      robots: 'noindex,follow'
    )
  end
end
