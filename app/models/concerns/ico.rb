module ICO
  extend ActiveSupport::Concern

  included do
    alias_method "is_listed?", "historical_data_exists?"
  end

  def category
    is_listed? ? 'listed' : 'ico'
  end

  def is_ico?
    !is_listed?
  end

  def historical_data_exists?
    Rails.cache.fetch(
      "/coins/#{symbol}/historical_data_exists?",
      { expires_in: 1.day }
    ) do
      url = "#{ENV.fetch('COINFI_PRICES_URL')}" <<
        "api/v1/coins/#{symbol}/daily_history.json"
      response = Net::HTTP.get_response(URI.parse(url))
      response.kind_of? Net::HTTPSuccess
    end
  end

end