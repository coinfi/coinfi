module CoinMarketCapPro
  module CoinMarketCapProHelpers
    def get_json_response_code(contents)
      contents.dig('status', 'error_code') || 0
    end

    def get_error_message(contents)
      contents.dig('status', 'error_message')
    end

    def currency
      return "USD"
    end
  end
end