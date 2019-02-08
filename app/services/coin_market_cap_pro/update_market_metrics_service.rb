module CoinMarketCapPro
  class UpdateMarketMetricsService < Patterns::Service
    include CoinMarketCapProHelpers

    def initialize
      @healthcheck_url = ENV.fetch('HEALTHCHECK_MARKET_METRICS')
    end

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
        Net::HTTP.post(URI.parse("#{@healthcheck_url}/fail"), e.to_json)
      else
        healthcheck_success
      end
    end

    def healthcheck_success
      Net::HTTP.get(URI.parse(@healthcheck_url))
    end

    def load_cmc_data
      api_url = "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest"
      headers = get_default_api_headers
      response = begin
        HTTParty.get(api_url, :headers => headers)
      rescue HTTParty::Error
        nil
      end

      extract_api_data(response, @healthcheck_url)
    end
  end
end