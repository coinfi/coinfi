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

  def show_dark_mode
    @show_dark_mode = true
  end

  def show_dark_mode?
    @show_dark_mode
  end
  helper_method :show_dark_mode?

  def set_fluid
    @is_fluid = true
  end

  def is_fluid?
    @is_fluid
  end
  helper_method :is_fluid?

  # Helpers to use devise forms anywhere
  # https://github.com/plataformatec/devise/wiki/How-To:-Display-a-custom-sign_in-form-anywhere-in-your-app
  helper_method :resource_name, :resource, :devise_mapping, :resource_class

  def resource_name
    :user
  end

  def resource
    @resource ||= User.new
  end

  def resource_class
    User
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end
end
