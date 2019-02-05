module CoinMarketCapPro
  class UpdateMarketMetricsService < Patterns::Service
    include CoinMarketCapProHelpers

    def call
      update_metrics
    end

    private

    def update_metrics
      data = load_cmc_data
      perform_update_metrics(data) if data.present?
    end

    def perform_update_metrics(data)
      metrics = data.dig('quote', 'USD')
      begin
        MarketMetric.create!(
          total_market_cap: metrics["total_market_cap"],
          total_volume_24h: metrics["total_volume_24h"],
          timestamp: metrics["last_updated"],
        )
      rescue ActiveRecord::RecordNotUnique => e
        healthcheck_success
      rescue StandardError => e
        Net::HTTP.post(URI.parse("#{ENV.fetch('HEALTHCHECK_MARKET_METRICS')}/fail"), e.to_json)
      else
        healthcheck_success
      end
    end

    def healthcheck_success
      Net::HTTP.get(URI.parse(ENV.fetch('HEALTHCHECK_MARKET_METRICS')))
    end

    def load_cmc_data
      api_url = "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest"
      headers = { "X-CMC_PRO_API_KEY" => ENV.fetch('COINMARKETCAP_API_KEY') }
      response = HTTParty.get(api_url, :headers => headers)
      contents = JSON.parse(response.body)

      # ping health check if api error
      json_response_code = get_json_response_code(contents)
      unless response.success? && json_response_code == 0
        error_message = get_error_message(contents)
        Net::HTTP.post(URI.parse("#{ENV.fetch('HEALTHCHECK_MARKET_METRICS')}/fail"), "ERROR HTTP(#{response.code}) JSON(#{json_response_code}): #{error_message}")
        return nil
      end

      contents['data']
    end
  end
end