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

    def get_default_api_headers
      @default_api_headers ||= { "X-CMC_PRO_API_KEY" => ENV.fetch('COINMARKETCAP_API_KEY') }
    end

    def extract_api_data(response, healthcheck_url = nil)
      contents = JSON.parse(response.body)

      # ping health check if api error
      json_response_code = get_json_response_code(contents)

      if response.success? && json_response_code == 0 then
        return contents['data']
      end

      error_message = "ERROR HTTP(#{response.code}) JSON(#{json_response_code}): #{get_error_message(contents)}"
      if healthcheck_url.present?
        Net::HTTP.post(URI.parse("#{healthcheck_url}/fail"), error_message)
      else
        puts error_message
      end

      nil
    end

    def log_or_ping_on_missing_data(missing_data, healthcheck_url = nil)
      if missing_data.empty?
        Net::HTTP.get(URI.parse(healthcheck_url)) unless healthcheck_url.blank?
      else
        if healthcheck_url.present?
          Net::HTTP.post(URI.parse("#{healthcheck_url}/fail"), missing_data.to_json)
        else
          pp missing_data
        end
      end
    end
  end
end