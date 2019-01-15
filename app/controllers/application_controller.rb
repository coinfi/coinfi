class ApplicationController < ActionController::Base
  include Responses
  MAX_ACCEPTABLE_REPLICATION_LAG = ApplicationHelper::MAX_ACCEPTABLE_REPLICATION_LAG

  protect_from_forgery with: :exception
  before_action :set_locale

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

  def hide_footer
    @hide_footer = true
  end

  def hide_footer?
    @hide_footer
  end
  helper_method :hide_footer?

  def hide_currency
    @hide_currency = true
  end

  def hide_currency?
    @hide_currency
  end
  helper_method :hide_currency?

  def set_fluid
    @is_fluid = true
  end

  def is_fluid?
    @is_fluid
  end
  helper_method :is_fluid?
end
