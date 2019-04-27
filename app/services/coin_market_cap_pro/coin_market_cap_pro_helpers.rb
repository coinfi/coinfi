module CoinMarketCapPro
  module CoinMarketCapProHelpers
    include ::HealthcheckHelpers

    def get_json_response_code(contents)
      contents.dig('status', 'error_code') || 0
    end

    def get_error_message(contents)
      contents.dig('status', 'error_message')
    end

    def currency
      return "USD"
    end

    def get_default_api_headers
      @default_api_headers ||= { "X-CMC_PRO_API_KEY" => ENV.fetch('COINMARKETCAP_API_KEY') }
    end

    def extract_api_data(response, healthcheck_url = nil)
      if response.blank?
        healthcheck_or_log_error('No API response found.', healthcheck_url)
        return nil
      end

      contents = JSON.parse(response.body)

      # ping health check if api error
      json_response_code = get_json_response_code(contents)

      if response.success? && json_response_code == 0 then
        return contents['data']
      end

      error_message = "ERROR HTTP(#{response.code}) JSON(#{json_response_code}): #{get_error_message(contents)}"
      healthcheck_or_log_error(error_message, healthcheck_url)
      nil
    end
  end
end