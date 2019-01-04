require 'sidekiq-scheduler'
class RefreshTokenMetricViews
  include Sidekiq::Worker

  def perform
    hc_url = ENV.fetch('HEALTHCHECK_TOKEN_VIEWS')

    metrics_ingest = IngestEtlDbMetricsService.call

    # refresh views if metrics were ingested
    if metrics_ingest.result > 0
      metrics_refresh = RefreshTokenMetricsViewsService.call
    end

    # Ping healthcheck
    if metrics_ingest.log_errors.present? && metrics_ingest.log_errors.length > 0
      Net::HTTP.post(URI.parse("#{hc_url}/fail"), metrics_ingest.log_errors.to_json)
    else
      Net::HTTP.get(URI.parse(hc_url))
    end
  end
end