module Validators
  extend ActiveSupport::Concern

  included do
  end

  def is_url? url
    url =~ /\A#{URI::regexp(['http', 'https'])}\z/
  end

end