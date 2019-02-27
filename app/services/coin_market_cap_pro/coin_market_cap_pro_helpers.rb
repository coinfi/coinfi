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

    def log_or_ping_on_missing_data(missing_data, healthcheck_url = nil)
      if missing_data.empty?
        Net::HTTP.get(URI.parse(healthcheck_url)) unless healthcheck_url.blank?
      else
        healthcheck_or_log_error(missing_data, healthcheck_url)
      end
    end

    def healthcheck_or_log_error(error, healthcheck_url = nil)
      if healthcheck_url.present?
        Net::HTTP.post(URI.parse("#{healthcheck_url}/fail"), error.try(:to_json))
      else
        if error.is_a?(Hash)
          puts "Failure with error as Hash:"
          error.each do |k, v|
            puts "[#{k}] #{v}"
          end
        elsif error.is_a?(Array)
          puts "Failure with error as Array:"
          error.each do |v|
            puts "#{v}"
          end
        else
          puts error
        end
      end
    end
  end
end