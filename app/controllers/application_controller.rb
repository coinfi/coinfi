class ApplicationController < ActionController::Base
  include Responses

  protect_from_forgery with: :exception
  before_action :set_locale
  before_action :set_nav_exchanges, unless: :indicators_controller?
  before_action :set_no_seo, if: :devise_controller?
  append_before_action :set_amp_rel, if: :has_amp?, unless: :is_amp?
  append_before_action :set_amp_canonical, if: :is_amp?

  breadcrumb 'Home', :root_path

private

  def set_locale
    I18n.locale = I18n.default_locale
  end

  def default_url_options
    return {} if I18n.locale == I18n.default_locale
    { locale: I18n.locale }
  end

  def set_amp_rel
    set_meta_tags(amphtml: url_for(format: :amp, only_path: false))
  end

  def set_amp_canonical
    set_meta_tags(canonical: url_for(format: :html, only_path: false))
  end

  def set_nav_exchanges
    @crypto_exchanges ||= Rails.cache.fetch("nav_exchanges", expires_in: 24.hours) do
      ExchangeReview.includes(:exchange_categories, :cmc_exchange).where(exchange_categories: {slug: 'crypto'}).limit(10)
    end
  end

protected

  def record_not_found
    render_404
  end

  def after_sign_in_path_for(resource)
    request.env['omniauth.origin'] || stored_location_for(resource) || root_path
  end

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
      robots: 'noindex, nofollow'
    )
  end

  def set_jsonld(json_hash)
    if json_hash.kind_of? String
      @jsonld_data = json_hash
    else
      @jsonld_data = json_hash.to_json
    end
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

  def set_amp
    @has_amp = true
  end

  def has_amp?
    @has_amp == true
  end
  helper_method :has_amp?

  def is_amp?
    @has_amp && request.format.amp?
  end
  helper_method :is_amp?

  def indicators_controller?
    controller_name == 'indicators'
  end

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
